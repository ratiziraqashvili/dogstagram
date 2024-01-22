import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const user = await currentUser()
        

        if (!user?.id || !user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const followeringList = await db.user.findUnique({
            where: {
                clerkId: user.id,
            },
            select: {
                following: {
                  select: {  
                    followingId: true, 
                 },
                },
              },
        })
        
        const followingIds = followeringList?.following.map((follow) => follow.followingId.replace(/"/g, ''))

        return NextResponse.json(followingIds)
    } catch (error) {
        console.error(error);
        return new Response("Failed to fetch following List", { status: 500 });
    }
}