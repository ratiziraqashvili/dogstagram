import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;

        if (!userId) {
            return new NextResponse('Missing userId parameter', { status: 400 });
        }

        const user = await db.user.findUnique({
            where: {
                clerkId: userId,
            }
        })

        return NextResponse.json(user);
    } catch (error) {
        console.log("Error in get user router", error)
    }
}