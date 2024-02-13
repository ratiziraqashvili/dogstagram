import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NotificationType } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(7, "10s"),
})

export const config = {
    runtime: "edge",
}

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const { id, userId: authorId } = body;
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

        if (!id || !authorId) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        const alreadySaved = await db.savedPosts.findFirst({
            where: {
                postId: id,
                userId: authorId,
                savedUserId: user.id,
            }
        })

        if (alreadySaved) {
            return new NextResponse("already saved", { status: 400 });
        }

        const post = await db.savedPosts.create({
            data: {
                postId: id,
                userId: authorId,
                savedUserId: user.id,
            }
        })

        if (user.id !== authorId) {
            await db.notification.create({
                data: {
                    sender: user.id,
                    recipient: authorId,
                    postId: id,
                    type: NotificationType.FAVORITE,
                }
            })
        }

        return NextResponse.json(post);
    } catch (error) {
        console.log("error in [API_POSTS_FAVORITE_POST]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);
        const ip = req.ip;

        const postId = searchParams.get("postId");
        const authorId = searchParams.get("authorId");

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

        if (!postId) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        const isFavoriteExist = await db.savedPosts.findFirst({
            where: {
                savedUserId: user.id,
                postId: postId,
            }
        })

        if (!isFavoriteExist) {
            return new NextResponse("favorited post you trying to delete does not exist", { status: 400 });
        }

        const deletePost = await db.savedPosts.delete({
            where: {
               userId_postId_savedUserId: {
                    postId,
                    savedUserId: user.id,
                    userId: authorId!
               }
            }
        });

        return NextResponse.json(deletePost);

    } catch (error) {
        console.log("error in [API_POSTS_FAVORITE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}