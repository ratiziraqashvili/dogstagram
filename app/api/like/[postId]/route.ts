import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { postId: string; } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        const alreadyLiking = await db.like.findFirst({
            where: {
                userId: user.id,
                postId,
            }
        })

        if (alreadyLiking) {
            return new NextResponse("already liked", { status: 400 });
        }

        const like = await db.like.create({
            data: {
                userId: user.id,
                postId,
            }
        })

        return NextResponse.json(like);

    } catch (error) {
        console.log("error in server [API_LIKE_[POSTID]]_request_delete", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { postId: string; } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        const like = await db.like.findFirst({
            where: {
                userId: user.id,
                postId
            }
        })

        if (!like) {
            return new NextResponse("There are no like to delete", { status: 400 })
        }

        const deletedLike = await db.like.delete({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId
                }
            }
        })

        return NextResponse.json(deletedLike);
        
    } catch (error) {
        console.log("error in server [API_LIKE_[POSTID]]_request_delete", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}