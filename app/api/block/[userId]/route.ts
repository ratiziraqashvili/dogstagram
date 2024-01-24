import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { userId: string }}) {
    try {
        const profileId = params.userId;

        console.log(profileId)

        const currUser = await currentUser();

        if (!currUser || !currUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!profileId) {
            return new NextResponse("profileId is missing but it is required", { status: 400 })
        }

        if (profileId === currUser.id) {
            return new NextResponse("User can not block itself", { status: 400 })
        }

        console.log(`User ${currUser.id} is blocking user ${profileId}`)

        const alreadyBlocked = await db.blockedUser.findFirst({
            where: {
                userId: currUser.id,
                blockedUserId: profileId 
            }
        })

        if (alreadyBlocked) {
            return new NextResponse("User already blocked", { status: 400 })
        }

        const userFollowingBlocked = await db.follow.findFirst({
            where: {
                followerId: currUser.id,
                followingId: profileId
            }
        })

        const blockedFollowingUser = await db.follow.findFirst({
            where: {
                followerId: profileId,
                followingId: currUser.id,
            }
        })

        console.log(userFollowingBlocked, blockedFollowingUser)

        if (userFollowingBlocked) {
            await db.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currUser.id,
                        followingId: profileId
                    }
                }
            })
        }

        if (blockedFollowingUser) {
            await db.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currUser.id,
                        followingId: profileId,
                    }
                }
            })
        }

        const block = await db.blockedUser.create({
            data: {
                userId: currUser.id,
                blockedUserId: profileId
            }
        })

        console.log(block)

        return NextResponse.json(block)

    } catch (error) {
        console.log("blocking user has failed", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}