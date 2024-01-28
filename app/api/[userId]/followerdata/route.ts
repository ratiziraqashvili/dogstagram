import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string }}) {
   try {
    if (!params.userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const followerDetails = await db.follow.findMany({
        where: {
            followingId: params.userId 
        },
        select: {
            follower: {
                select: {
                    imageUrl: true,
                    username: true,
                    firstName: true,
                    clerkId: true,
                }
            }
        }
    })

    if (!followerDetails) {
        return new NextResponse("No follower")
    }

    return NextResponse.json(followerDetails, { status: 200 });

   } catch (error) {
    console.log("Error in Follower Data", error);
    return new NextResponse("Failed to get followerDetails", { status: 500 });
   }
}