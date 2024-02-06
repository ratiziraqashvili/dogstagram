import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }:  { params: { postId: string } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        const { searchParams } = new URL(req.url);

        const authorId = searchParams.get("authorId")

        console.log("authorId:", authorId)

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!postId) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (authorId !== user.id) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const post = await db.post.findFirst({
            where: {
                id: postId
            }
        })

        if (!post) {
            return new NextResponse("Post does not exist", { status: 404 })
        }

        const deletedPost = await db.post.delete({
            where: {
                id: postId,
                userId: user.id,
            }
        })
        
        console.log("deletedPost:", deletedPost);
        

        return NextResponse.json(deletedPost);

    } catch (error) {
        console.log("[API_POSTS_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}