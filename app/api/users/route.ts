import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const user = await currentUser();
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        const lowercasedSearchTerm = username?.toLowerCase();

        console.log(lowercasedSearchTerm)

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        };

        if (!username || typeof username !== "string") {
            return new NextResponse("Invalid username", { status: 400 });
        };

        const users = await db.user.findMany({
            where: {
                username: {
                    contains: lowercasedSearchTerm,
                },
            },
            select: {
                username: true,
                clerkId: true,
                imageUrl: true,
                firstName: true,
            }
        })

        return NextResponse.json(users);

    } catch (error) {
        console.log("error in server [API_USERS]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}