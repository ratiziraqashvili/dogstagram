import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NotificationType } from "@prisma/client";

// const ratelimit = new Ratelimit({
//     redis: kv,
//     limiter: Ratelimit.slidingWindow(7, "10s"),
// })

export async function POST(req: NextRequest, { params }: { params: { postId: string; } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        const ip = req.ip;
        const { searchParams } = new URL(req.url);
        const recipient = searchParams.get("recipient");
        const restrictedUserId = searchParams.get("restrictedUserId")

        // const { limit, reset, remaining } = await ratelimit.limit(ip!);

        // if (remaining === 0) {
        //     return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
        //         status: 429,
        //         headers: {
        //             "X-RateLimit-Limit": limit.toString(),
        //             "X-RateLimit-Remaining": remaining.toString(),
        //             "X-RateLimit-Reset": reset.toString(),
        //         }
        //     })
        // }

        if (restrictedUserId === user?.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        const alreadyLiking = await db.like.findFirst({
            where: {
                userId: user.id,
                postId,
            }
        })

        if (alreadyLiking) {
            return new NextResponse("already liked", { status: 400 });
        }

        const like = await db.like.create({
            data: {
                userId: user.id,
                postId,
            }
        })

        if (user.id !== recipient) {
            await db.notification.create({
                data: {
                    sender: user.id,
                    postId,
                    type: NotificationType.LIKE,
                    recipient: recipient!
                }
            })
        }

        return NextResponse.json(like);

    } catch (error) {
        console.log("error in server [API_LIKE_[POSTID]]_request_delete", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { postId: string; } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        const ip = req.ip;

        // const { limit, reset, remaining } = await ratelimit.limit(ip!);

        // if (remaining === 0) {
        //     return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
        //         status: 429,
        //         headers: {
        //             "X-RateLimit-Limit": limit.toString(),
        //             "X-RateLimit-Remaining": remaining.toString(),
        //             "X-RateLimit-Reset": reset.toString(),
        //         }
        //     })
        // }

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        const like = await db.like.findFirst({
            where: {
                userId: user.id,
                postId
            }
        })

        if (!like) {
            return new NextResponse("There are no like to delete", { status: 400 })
        }

        const deletedLike = await db.like.delete({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId
                }
            }
        })

        return NextResponse.json(deletedLike);
        
    } catch (error) {
        console.log("error in server [API_LIKE_[POSTID]]_request_delete", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}