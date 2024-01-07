import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const user = await currentUser()
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

        if (!userId || !user?.id || !user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const followers = await db.user.findUnique({
            where: {
                clerkId: userId,
            },
            select: {
                followers: {
                  select: { 
                    followerId: true, 
                    followingId: true, 
                 },
                },
              },
        })

        const followerCount = await db.follow.count({
            where: {
                followingId: userId || user?.id
            }
        })

        const followingCount = await db.follow.count({
            where: {
                followerId: userId
            }
        })

        
        const followingIds = followers?.followers.map((user) => user.followingId);
        
        const followerIds = followers?.followers.map((user) => user.followerId);
        
        
        if (!followerIds || !followerIds.includes(user?.id)) {
            return NextResponse.json({ followingIds: [], followerCount, followingCount }, { status: 200 });
        }

        return NextResponse.json({ followingIds, followerCount, followingCount }, { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch following", { status: 500 });
    }
}