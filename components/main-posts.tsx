import { PostInfoType } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { formatTimeDifference } from "@/lib/timeUtils";
import Link from "next/link";
import { PostImage } from "./post-image";
import { MainPostInput } from "./main-post-input";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { MoreHorizOpen } from "./more-horiz-open";
import { getBlockedUserIds } from "@/lib/blocked-users";
import { CheckCircle2 } from "lucide-react";
import { getComments } from "@/lib/getComments";

interface MainPostsProps {
  posts: PostInfoType;
}

export const MainPosts = async ({ posts }: MainPostsProps) => {
  const user = await currentUser();
  const blockedIds = await getBlockedUserIds();

  const likes = await db.like.findMany({
    where: {
      userId: user?.id,
    },
  });

  const restrictedUsers = await db.restrict.findMany({
    where: {
      restrictedUserId: user?.id,
    },
  });

  const savedPostsId = await db.savedPosts.findMany({
    where: {
      savedUserId: user?.id,
    },
    select: {
      postId: true,
    },
  });

  const getFormattedtime = (createdAt: Date) => {
    return formatTimeDifference(createdAt);
  };

  const comments = await getComments({ blockedIds });

  return (
    <div className="flex-1 mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] md:mt-0 mt-[3.8rem] pb-20 sm:pb-0">
      {posts.map(async (post) => {
        const likeIds = likes.map((like) => like.postId);
        const isLiked = likeIds.includes(post.id);
        const restrictAuthorId = restrictedUsers.map((user) => user.userId);
        const restrictedUserId = restrictedUsers.map(
          (user) => user.restrictedUserId
        );

        const isRestricted =
          restrictAuthorId.includes(post.userId) &&
          restrictedUserId.includes(user?.id!);

        const restricted = await db.restrict.findMany({
          where: {
            userId: post.userId,
          },
        });

        return (
          <div
            key={post.id}
            className="sm:max-w-[75%] xl:max-w-[65%] mx-auto flex flex-col lg:pt-2 border-b-[1px] sm:px-0 px-2"
          >
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
                  <h1 className="text-sm font-semibold active:text-muted-foreground">
                    {post.user?.username}
                  </h1>
                  <span className="text-xs text-muted-foreground">
                    &bull; {getFormattedtime(post.createdAt)}
                  </span>
                </div>
              </Link>
              <div>
                <MoreHorizOpen post={post} />
              </div>
            </div>
            <div className="z-0">
              <PostImage imageUrl={post.imageUrl} />
            </div>
            <div>
              <MainPostInput
                comments={comments}
                likes={likes}
                savedPostsId={savedPostsId}
                isRestricted={isRestricted}
                post={post}
                liked={isLiked}
                restrictedUserId={restrictedUserId}
                restrictedUsers={restricted}
              />
            </div>
          </div>
        );
      })}
      <div className="sm:max-w-[75%] xl:max-w-[65%] mx-auto flex flex-col justify-center sm:px-0 py-16">
        <div className="flex flex-col justify-center items-center">
          <CheckCircle2 strokeWidth="0.5px" className="w-28 h-28" />
          <div>
            <h1 className="text-lg text-center">You're all caught up</h1>
            <p className="text-sm text-muted-foreground text-center">
              You've seen all new posts from the past 14 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
