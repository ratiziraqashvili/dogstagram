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

    const followerDetails = await db.follow.findMany({
        where: {
            followingId: userId
        },
        select: {
            follower: {
                select: {
                    imageUrl: true,
                    username: true,
                    firstName: true,
                }
            }
        }
    })

    return NextResponse.json(followerDetails, { status: 200 });

   } catch (error) {
    console.log(error);
    return new NextResponse("Failed to get followerDetails", { status: 500 });
   }
}