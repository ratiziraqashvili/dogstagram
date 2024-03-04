import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, "10s"),
})

export const runtime = "edge"

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const user = await currentUser();
        const { userId } = params;

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
        
        if (!user || !user.id || !userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const follow = await db.follow.delete({
           where: {
            followerId_followingId: {
                followerId: user.id,
                followingId: userId
            }
           }
        })

        if (!follow) {
            return new NextResponse("There are no follow to delete", { status: 404 })
        }

        return NextResponse.json(follow)

    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}