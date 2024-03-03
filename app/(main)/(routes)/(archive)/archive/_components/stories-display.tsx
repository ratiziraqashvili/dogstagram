"use client";

import { StoryType } from "@/types";
import { Clock8 } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface StoriesDisplayProps {
  expiredStories: StoryType;
}

export const StoriesDisplay = ({ expiredStories }: StoriesDisplayProps) => {
  if (!expiredStories) {
    return (
      <div className="h-full">
        <div className="flex justify-center gap-14 flex-col items-center pt-20">
          <Clock8 size={45} />
          <div className="flex flex-col gap-1 items-center">
            <h1 className="text-xl">Add to your story</h1>
            <p className="text-sm text-center w-[70%]">
              Keep your stories in your archive after they disappear, so you can
              look back on your memories. Only you can see what's in your
              archive.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid xl:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-1 pt-10 md:pt-1">
      {expiredStories.map((story) => (
        <div>
          <CldImage
            src={story.imageUrl}
            alt="Posts"
            width="900"
            height="900"
            className="cursor-pointer hover:brightness-75 h-80 object-cover"
            sharpen={60}
            priority
          />
        </div>
      ))}
    </div>
  );
};
