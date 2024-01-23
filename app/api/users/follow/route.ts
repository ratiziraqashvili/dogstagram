import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const otherUserId = JSON.parse(await req.text()).trim();

        if (!user || !user.id || !otherUserId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const alreadyFollowing = await db.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: otherUserId
            }
        })

        if (alreadyFollowing) {
            return new NextResponse("Already following this user", { status: 400 })
        }

        const follow = await db.follow.create({
            data: {
                followerId: user.id,
                followingId: otherUserId,
            }
        })

        return NextResponse.json(follow)

    } catch (error) {
        console.error("Error on follow:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}