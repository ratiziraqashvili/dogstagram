import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
    try {
        const user = await currentUser();
        const postId = params.postId;
        const { searchParams } = new URL(req.url);

        const content = searchParams.get("content");

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!postId) {
            return new NextResponse("postId is required but its missing", { status: 400 });
        }

        if (!content) return null;

        const comment = await db.comment.create({
            data: {
                userId: user.id,
                postId: postId,
                content
            },
            include: {
                user: {
                    select: {
                        imageUrl: true,
                        username: true,
                    }
                }
            }
        })

        console.log(comment)

        return NextResponse.json(comment);

    } catch (error) {
        console.log("error in server [API_COMMENT_[POSTID]]", error);
        return new NextResponse("Internal error");
    }
}