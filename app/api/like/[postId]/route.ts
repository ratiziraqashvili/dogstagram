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
        console.log("error in server [API_LIKE_[POSTID]]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { postId: string; } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        const isLiked = await db.like.findFirst({
            where: {
                userId: user?.id,
                postId,
            }
        })

        return NextResponse.json(!!isLiked);

    } catch (error) {
        console.log("error in server [API_LIKE_[POSTID]]");
        return new NextResponse("Internal Error", { status: 500})
    }
}