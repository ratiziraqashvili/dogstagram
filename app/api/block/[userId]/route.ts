import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, params : { userId: string }) {
    try {
        const profileId = params.userId;
        const currUser = await currentUser();

        if (!currUser || !currUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!profileId) {
            return new NextResponse("profileId is missing but it is required", { status: 400 })
        }

        if (profileId === currUser.id) {
            return new NextResponse("User can not block itself", { status: 400 })
        }

        console.log(`User ${currUser.id} is blocking user ${profileId}`)

        const block = await db.blockedUser.create({
            data: {
                userId: currUser.id,
                blockedUserId: profileId
            }
        })

        console.log(block)

        return NextResponse.json(block)

    } catch (error) {
        console.log("blocking user has failed", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}