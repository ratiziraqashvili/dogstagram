import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        
    } catch (error) {
        console.log("error in server [API_USERS]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}