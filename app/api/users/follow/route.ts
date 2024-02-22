import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);

        const otherUserId = searchParams.get("otherUserId")

        console.log("otherUserId:", otherUserId)

        if (!user || !user.id || !otherUserId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const alreadyFollowing = await db.follow.findFirst({
            where: {
                followerId: user.id,
                followingId: otherUserId
            }
        })

        const isUserBlocked = await db.blockedUser.findFirst({
            where: {
                userId: user.id,
                blockedUserId: otherUserId
            }
        })

        if (isUserBlocked) {
            return new NextResponse("You cannot follow this user as they have blocked you or you just blocked them", { status: 403 })
        }

        if (alreadyFollowing) {
            return new NextResponse("Already following this user", { status: 400 })
        }

        if (user.id === otherUserId) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const follow = await db.follow.create({
            data: {
                followerId: user.id,
                followingId: otherUserId,
            }
        })

        await db.notification.create({
            data: {
                sender: user.id,
                recipient: otherUserId,
                type: NotificationType.FOLLOW,
            }
        })

        return NextResponse.json(follow)

    } catch (error) {
        console.error("Error on follow:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}