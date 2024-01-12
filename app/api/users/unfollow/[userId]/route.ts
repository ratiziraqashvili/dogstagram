import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    try {
        const user = await currentUser();
        const { userId } = params
        
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

        return NextResponse.json(follow)

    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}