import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   try {
    const url = req.url;
    
       
    const parts = url.split("/")

    let userId;

    for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];

        if (part.length === 32) {
            userId = part;
            break;
        }
    }

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const followingDetails = await db.follow.findMany({
        where: {
           followerId: userId,
        },
        select: {
           followingId: true,
        }
    })

    if (!followingDetails || followingDetails.length === 0) {
        return new NextResponse("User is not following anyone [FOLLOWING_DATA_ROUTE.TS_LINE_36]", { status: 200 })
    }

   const followingIds = followingDetails.map(f => f.followingId.replace(/"/g, ''))

    const users = await db.user.findMany({
        where: {
           clerkId: {
                in: followingIds
            }
        },
        select: {
            imageUrl: true,
            username: true,
            firstName: true,
            clerkId: true,
        }
    })
    
    return NextResponse.json(users, { status: 200 });

   } catch (error) {
    console.log("Error in Following Data", error);
    return new NextResponse("Failed to get followingDetails", { status: 500 });
   }
}