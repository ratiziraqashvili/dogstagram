import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(params:  { userId: string }) {
    try {
        const { userId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const following = await db.user.findUnique({
            where: {
                clerkId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true
                    }
                }
            }
        })

    } catch (error) {
        
    }
}