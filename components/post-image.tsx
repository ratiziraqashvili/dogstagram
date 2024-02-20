"use client"

import { CldImage } from "next-cloudinary";

interface PostImageProps {
    imageUrl: string;
}

export const PostImage = ({ imageUrl }: PostImageProps) => {
    return (
        <>
         <CldImage
          src={imageUrl}
          alt="Image"
          width="600"
          height="664"
          crop="fill"
          className="object-cover md:min-w-24 rounded-sm"
          priority
        />
        </>
    )
}