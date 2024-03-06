import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NotificationType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "10s"),
})

const MAX_COMMENT_LENGTH = 150;

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        
        const { searchParams } = new URL(req.url);
        const content = searchParams.get("content");
        const recipient = searchParams.get("recipient");
        const restrictedUserId = searchParams.get("restrictedUserId");
        
        const ip = req.ip;
        const { limit, reset, remaining } = await ratelimit.limit(ip!);
        

        if (remaining === 0) {
            return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
                status: 429,
                headers: {
                    "X-RateLimit-Limit": limit.toString(),
                    "X-RateLimit-Remaining": remaining.toString(),
                    "X-RateLimit-Reset": reset.toString(),
                }
            })
        }

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (restrictedUserId === user?.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        if (!postId) {
            return new NextResponse("postId is required but it is missing", { status: 400 });
        }

        if (!content) return null;

        if (content.length > MAX_COMMENT_LENGTH) {
            return new NextResponse("comment is too large", { status: 400 })
        }
        
        const comment = await db.comment.create({
            data: {
                userId: user.id,
                postId: postId,
                content
            },
            include: {
                user: {
                    select: {
                        imageUrl: true,
                        username: true,
                    }
                }
            }
        })
        
        if (user.id !== recipient) {
            await db.notification.create({
                data: {
                    sender: user.id,
                    recipient: recipient!,
                    postId: postId,
                    type: NotificationType.COMMENT,
                }
            });
        }
        
        return NextResponse.json(comment);

    } catch (error) {
        console.log("error in server [API_COMMENT_[POSTID]]", error);
        return new NextResponse("Internal error");
    }
}