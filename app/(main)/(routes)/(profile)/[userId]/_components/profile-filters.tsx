"use client";

import { cn } from "@/lib/utils";
import { Bookmark, Grid3X3 } from "lucide-react";
import { useState } from "react";
import { Posts } from "./posts";
import { SavedPosts } from "./saved-posts";
import { useAuth } from "@clerk/nextjs";

interface ProfileFiltersProps {
  profileId: string;
}

export const ProfileFilters = ({ profileId }: ProfileFiltersProps) => {
  const [filter, setFilter] = useState("posts");
  const { userId } = useAuth();

  const onFilterClick = (type: string) => {
    setFilter(type);
  };

  return (
    <div>
      <div className="md:w-[80%] md:mx-auto md:justify-center md:flex gap-10 hidden">
        <div
          onClick={() => onFilterClick("posts")}
          className={cn(
            "flex items-center justify-center px-1 py-3 gap-1.5 cursor-pointer border-t-[1px] border-black border-opacity-0",
            filter === "posts" && "border-opacity-100 transition"
          )}
        >
          <Grid3X3
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground",
              filter === "posts" && "text-black"
            )}
          />
          <span
            className={cn(
              "text-muted-foreground uppercase text-[0.8rem] font-[500]",
              filter === "posts" && "text-black"
            )}
          >
            Posts
          </span>
        </div>
        {userId === profileId && (
          <div
            onClick={() => onFilterClick("saved")}
            className={cn(
              "flex items-center justify-center px-1 py-3 gap-1.5 cursor-pointer border-t-[1px] border-black border-opacity-0",
              filter === "saved" && "border-opacity-100 transition"
            )}
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                filter === "saved" && "text-black"
              )}
            />
            <span
              className={cn(
                "text-muted-foreground uppercase text-[0.8rem] font-[500]",
                filter === "saved" && "text-black"
              )}
            >
              Saved
            </span>
          </div>
        )}
      </div>
      <div className="md:hidden w-full flex justify-around sm:justify-center">
        <div
          className={cn(
            "cursor-pointer border-t-[1px] border-black border-opacity-0 py-3 w-full flex justify-center",
            filter === "posts" && "border-opacity-100"
          )}
          onClick={() => onFilterClick("posts")}
        >
          <Grid3X3
            className={cn(
              "text-muted-foreground",
              filter === "posts" && "text-sky-500"
            )}
          />
        </div>
        {userId === profileId && (
          <div
            className={cn(
              "cursor-pointer w-full border-t-[1px] border-black border-opacity-0 py-3 flex justify-center",
              filter === "saved" && "border-opacity-100"
            )}
            onClick={() => onFilterClick("saved")}
          >
            <Bookmark
              className={cn(
                "text-muted-foreground",
                filter === "saved" && "text-sky-500"
              )}
            />
          </div>
        )}
      </div>
      <div className="md:w-[80%] mx-auto">
        {filter === "posts" && <Posts />}
        {filter === "saved" && <SavedPosts />}
      </div>
    </div>
  );
};
