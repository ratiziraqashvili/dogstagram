import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { clerkId: string } }) {
    try {
        const user = await currentUser();
        const { clerkId } = params;
        
        if (!user || !user.id || !clerkId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const existingFollow = await db.follow.findFirst({
            where: {
                followerId: clerkId,
                followingId: user.id
            }
        })

        if (!existingFollow) {
            return new NextResponse("Not following", {status: 400}) 
          }

        const follow = await db.follow.delete({
           where: {
            followerId_followingId: {
                followerId: clerkId,
                followingId: user.id
            }
           }
        })

        return NextResponse.json(follow)

    } catch (error) {
        console.error(error)
        return new NextResponse("Error unfollowing", { status: 500 })
    }
}