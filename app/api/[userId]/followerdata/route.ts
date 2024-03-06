import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string }}) {
   try {
    if (!params.userId) {
        return new NextResponse('Missing userId parameter', { status: 400 });
    }

    const followerDetails = await db.follow.findMany({
        where: {
            followingId: params.userId 
        },
        select: {
           followerId: true
        }
    })

    if (!followerDetails) {
        return new NextResponse("No follower", { status: 200 })
    }

    const followerIds = followerDetails.map(f => f.followerId.replace(/"/g, ''))

    const users = await db.user.findMany({
        where: {
           clerkId: {
                in: followerIds
            }
        },
        select: {
            imageUrl: true,
            username: true,
            firstName: true,
            clerkId: true,
        }
    })

    return new NextResponse(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });

   } catch (error) {
    console.log("Error in Follower Data", error);
    return new NextResponse("Failed to get followerDetails", { status: 500 });
   }
}