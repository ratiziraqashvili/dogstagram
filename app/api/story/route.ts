import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const {
            imageUrl,
            isDog,
            story: isStory,
        } = body;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!isStory) return null;

        if (!imageUrl) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (!isDog) {
            return;
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const story = await db.story.create({
            data: {
                userId: user.id,
                imageUrl,
                expiresAt, 
            }
        })

        return NextResponse.json(story);

    } catch (error) {
        console.log("error in server [API_STORY]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}