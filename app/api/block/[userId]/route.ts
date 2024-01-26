import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { userId: string }}) {
    try {
        const blockedUserId = params.userId;

        const currUser = await currentUser();

        if (!currUser || !currUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!blockedUserId) {
            return new NextResponse("profileId is missing but it is required", { status: 400 })
        }

        if (blockedUserId === currUser.id) {
            return new NextResponse("User can not block itself", { status: 400 })
        }

        console.log(`User ${currUser.id} is blocking user ${blockedUserId}`)

        const alreadyBlocked = await db.blockedUser.findFirst({
            where: {
                userId: currUser.id,
                blockedUserId 
            }
        })

        if (alreadyBlocked) {
            return new NextResponse("User already blocked", { status: 400 })
        }

        const userFollowingBlocked = await db.follow.findFirst({
            where: {
                followerId: currUser.id,
                followingId: blockedUserId
            }
        })

        const blockedFollowingUser = await db.follow.findFirst({
            where: {
                followerId: blockedUserId,
                followingId: currUser.id,
            }
        })

        console.log(userFollowingBlocked, blockedFollowingUser)

        if (userFollowingBlocked) {
            try {
                await db.follow.delete({
                    where: {
                        followerId_followingId: {
                            followerId: currUser.id,
                            followingId: blockedUserId
                        }
                    },
                })
            } catch (error) {
                console.log("Error while deleting userFollowingBlocked or record just dont exist", error)
            }
        }

        if (blockedFollowingUser) {
            try {
                await db.follow.delete({
                    where: {
                        followerId_followingId: {
                            followerId: blockedUserId,
                            followingId: currUser.id,
                        }
                    },
                })
            } catch (error) {
                console.log("Error while deleting blockedFollowingUser or record just dont exist")
            }
        }

        const block = await db.blockedUser.create({
            data: {
                userId: currUser.id,
                blockedUserId: blockedUserId
            }
        })

        console.log(block)

        return NextResponse.json(block)

    } catch (error) {
        console.log("blocking user has failed", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;

        const currUser = await currentUser();

        if (!currUser || !currUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!userId) {
            return new NextResponse("Missing required parameter blockedUserId", { status: 400 })
        }

        if (userId === currUser.id) return;

        const isBlockExist = await db.blockedUser.findFirst({
            where: {
                userId: currUser.id,
                blockedUserId: userId,
            }
        })

        if (!isBlockExist) return;

        const blockDeletion = await db.blockedUser.delete({
            where: {
                userId_blockedUserId:{
                    userId: currUser.id,
                    blockedUserId: userId
                }
            }
        })

        return NextResponse.json(blockDeletion);

    } catch (error) {
        console.log("Error in [BLOCK_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}