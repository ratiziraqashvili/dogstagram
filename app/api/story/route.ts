import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const {
            imageUrl,
            isDog,
            story,
        } = body;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!story) return null;

        if (!imageUrl) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (!isDog) {
            return;
        }

        

    } catch (error) {
        console.log("error in server [API_STORY]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}