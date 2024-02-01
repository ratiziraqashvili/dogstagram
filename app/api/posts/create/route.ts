import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const {
            imageUrl,
            caption,
            location,
            hideLikes,
            hideComments,
            isDog,
            isCropped
        } = body;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!imageUrl) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (!isDog) {
            return;
        }

        // const post = await db.post.create({
        //     data: {
                
        //     }
        // })

    } catch (error) {
        console.error("Error in [API_POSTS_CREATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}