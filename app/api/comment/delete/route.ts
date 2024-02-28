import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);

        const commentId = searchParams.get("commentId");
        const authorId = searchParams.get("authorId");

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!commentId || !authorId) {
            return new NextResponse("commentId and authorId are required but it is missing", { status: 400 });
        }

        if (user.id !== authorId) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const comment = await db.comment.findFirst({
            where: {
                id: commentId,
                userId: authorId,
            }
        })


        if (!comment) {
            return new NextResponse("comment does not exist to delete", { status: 404 });
        }

        const deletedComment = await db.comment.delete({
            where: {
                id: commentId,
                userId: authorId!,
            }
        })

        return NextResponse.json(deletedComment)

    } catch (error) {
        console.log("error in server [API_COMMENT_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}