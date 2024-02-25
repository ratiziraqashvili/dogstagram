import { currentUser } from "@clerk/nextjs";
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
        const currUser = await currentUser();
        const { searchParams } = new URL(req.url);

        const commentId = searchParams.get("commentId")
        const username = searchParams.get("username")

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

    } catch (error) {
        console.log("error in server [API_COMMENT_REPLY]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}