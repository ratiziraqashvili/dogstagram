import { PostInfoType } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface MainPostsProps {
  posts: PostInfoType;
}

export const MainPosts = ({ posts }: MainPostsProps) => {
  return (
    <div className="flex-1 mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] md:mt-0 mt-[3.8rem] bg-green-500 pt-2">
      {/* TODO: display available posts */}
      {posts.map((post) => {
        const formattedTime = formatTimeDifference(post.createdAt);

        return (
          <div className="sm:max-w-[75%] mx-auto">
            <div className="flex justify-between items-center p-3">
              <Link
                href={`/${post.userId}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div>
                  <ProfilePicture
                    imageUrl={post.user?.imageUrl}
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <h1 className="text-sm font-semibold ">
                    {post.user?.username}
                  </h1>
                  <span className="text-xs text-muted-foreground">
                    &bull; {formattedTime}
                  </span>
                </div>
              </Link>
              <div>
                <MoreHorizontal className="h-6 w-6 cursor-pointer" />
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        );
      })}
    </div>
  );
};
