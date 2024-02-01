import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_SECRET_CLOUDINARY_API_KEY
})

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const body = await req.json();
        const {
            imageUrl,
            caption,
            location,
            hideLikes,
            hideComments,
            isDog,
            isCropped
        } = body;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!imageUrl) {
            return new NextResponse("Missing required parameter", { status: 400 })
        }

        if (!isDog) {
            return;
        }

        let cloudinaryUrl = imageUrl;

        if (isCropped) {
          const cloudinaryResponse = await cloudinary.uploader.upload(imageUrl);
          cloudinaryUrl = cloudinaryResponse.secure_url; 
        }

        const post = await db.post.create({
            data: {
                imageUrl: cloudinaryUrl || imageUrl,
                userId: user.id,
                caption,
                location,
                hideLikes,
                hideComments
            }
        })

        return NextResponse.json(post);

    } catch (error) {
        console.error("Error in [API_POSTS_CREATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}