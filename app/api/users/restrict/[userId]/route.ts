import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const currUser = await currentUser();
        const userId = params.userId;

        if (!currUser || !currUser.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (currUser.id === userId) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        if (!userId) {
            return null;
        }

        const alreadyRestricted = await db.restrict.findFirst({
            where: {
                userId: currUser.id,
                restrictedUserId: userId,
            }
        })

        if (alreadyRestricted) {
            return new NextResponse("This user is already restricted", { status: 400 })
        }

        const restrict = await db.restrict.create({
            data: {
                userId: currUser.id,
                restrictedUserId: userId,
            }
        })

        return NextResponse.json(restrict);

    } catch (error) {
        console.log("error in server [API_USER_RESTRICT_[USERID]]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}