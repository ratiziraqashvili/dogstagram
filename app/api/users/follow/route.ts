import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const otherUserId = await req.json();

        if (!user || !user.id || !otherUserId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const follow = await db.follow.create({
            data: {
                followerId: user.id,
                followingId: otherUserId,
            }
        })

        return NextResponse.json(follow)

    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}