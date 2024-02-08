import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }:  { params: { postId: string } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        const { searchParams } = new URL(req.url);

        const authorId = searchParams.get("authorId");

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!postId) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (authorId !== user.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const updatedPost = await db.post.update({
            where: {
                userId: authorId,
                id: postId,
            },
            data: {
                hideComments: true,
            }
        })

        return NextResponse.json(updatedPost)

    } catch (error) {
        console.log("[API_POSTS_UPDATE_COMMENTS_[POSTID]]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}