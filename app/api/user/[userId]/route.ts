import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, params: { userId: string }) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !params.userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        

    } catch (error) {
        
    }
}