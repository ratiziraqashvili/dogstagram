import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, "10s"),
})

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const ip = req.ip;
        const { searchParams } = new URL(req.url);
        const reason = searchParams.get("reason");
        const postId = searchParams.get("postId");

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
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!postId || !reason) {
            return new NextResponse("postId or reason is required but its missing", { status: 400 });
        }

        const report = await db.report.create({
            data: {
                reason: reason!,
                userId: user?.id,
                postId,
            }
        })

        return NextResponse.json(report);

    } catch (error) {
        console.log("error in server [API_REPORT]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}