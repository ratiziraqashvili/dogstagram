import { db } from "@/lib/db";
import { NextResponse } from "next/server"
//@ts-ignore
export async function GET(req: Request, { params }) {
    try {
        const { userId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
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