import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const {
            imageUrl,
            caption,
            location,
            hideLikes,
            hideComments
        } = body;

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        const authorId = searchParams.get('authorId');

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!imageUrl) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (user.id !== authorId) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const editedPost = await db.post.update({
            where: {
                id: postId!,
                userId: authorId
            },
            data: {
                imageUrl,
                caption,
                location,
                hideLikes,
                hideComments
            }
        })

        console.log(editedPost);

        return NextResponse.json(editedPost);

    } catch (error) {
        console.log("error in [API_POSTS_UPDATE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}