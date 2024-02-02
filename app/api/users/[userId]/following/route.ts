import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const user = await currentUser()

        if (!params.userId || !user?.id || !user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const followers = await db.user.findUnique({
            where: {
                clerkId: params.userId,
            },
            include: {
                followers: {
                  select: { 
                    followerId: true, 
                    followingId: true, 
                 },
                },
              },
        })
        
        const followingIds = followers?.followers.map((user) => user.followingId);
        
        const followerIds = followers?.followers.map((user) => user.followerId);
        
        if (!followerIds || !followerIds.includes(user?.id)) {
            return NextResponse.json({ followingIds: [], }, { status: 200 });
        }

        return NextResponse.json({ followingIds }, { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch following", { status: 500 });
    }
}