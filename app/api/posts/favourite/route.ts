import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const { id, userId: authorId } = body;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!id || !authorId) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        const alreadySaved = await db.savedPosts.findFirst({
            where: {
                postId: id,
                userId: authorId,
                savedUserId: user.id,
            }
        })

        if (alreadySaved) {
            return new NextResponse("already saved", { status: 400 });
        }

        const post = await db.savedPosts.create({
            data: {
                postId: id,
                userId: authorId,
                savedUserId: user.id,
            }
        })

        console.log(post);

        return NextResponse.json(post);
    } catch (error) {
        console.log("error in [API_POSTS_FAVOURITE]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}