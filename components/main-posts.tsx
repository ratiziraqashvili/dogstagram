import { PostInfoType } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { PostImage } from "./post-image";
import { MainPostInput } from "./main-post-input";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

interface MainPostsProps {
  posts: PostInfoType;
}

export const MainPosts = async ({ posts }: MainPostsProps) => {
  const user = await currentUser();

  const likes = await db.like.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <div className="flex-1 mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] md:mt-0 mt-[3.8rem] pb-20">
      {/* TODO: display available posts */}
      {posts.map((post) => {
        const formattedTime = formatTimeDifference(post.createdAt);

        const likeIds = likes.map((like) => like.postId);
        const isLiked = likeIds.includes(post.id);

        console.log(isLiked)

        return (
          <div key={post.id} className="sm:max-w-[75%] xl:max-w-[65%] mx-auto flex flex-col lg:pt-2 border-b-[1px] sm:px-0 px-2">
            <div className="flex justify-between items-center py-3">
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
            <div className="z-0">
              <PostImage imageUrl={post.imageUrl} />
            </div>
            <div>
              <MainPostInput post={post}  liked={isLiked} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
