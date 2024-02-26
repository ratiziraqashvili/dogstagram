import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NotificationType } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "10s"),
})

export const config = {
    runtime: "edge",
}

const MAX_REPLY_LENGTH = 150;

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);

        const commentId = searchParams.get("commentId");
        const username = searchParams.get("username");
        const content = searchParams.get("content");
        const recipient = searchParams.get("recipient");
        const postId = searchParams.get("postId");

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

        if (!commentId || !content || !username) {
            return new NextResponse("required data is missing", { status: 400 });
        }

        if (content.length > MAX_REPLY_LENGTH) {
            return new NextResponse("reply is too large", { status: 400 })
        }

        const reply = await db.reply.create({
            data: {
                userId: user?.id,
                replyAuthorUsername: username,
                replyToCommentId: commentId,
                content,
                postId: postId!,
                replyAuthorId: recipient!,
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
                    type: NotificationType.REPLY,
                }
            });
        }

        return NextResponse.json(reply)

    } catch (error) {
        console.log("error in server [API_COMMENT_REPLY]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}