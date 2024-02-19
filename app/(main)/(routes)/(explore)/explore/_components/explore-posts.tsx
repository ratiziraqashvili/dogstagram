"use client";

import { useModal } from "@/hooks/use-modal-store";
import { CommentArray, PostInfoType } from "@/types";
import { Like, Post, Restrict } from "@prisma/client";
import { Heart, MessageCircle } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

interface ExplorePostsProps {
  posts: PostInfoType;
}

export const ExplorePosts = ({ posts }: ExplorePostsProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const isSmallScreen = useMediaQuery({ maxWidth: 420 });

  const onPostInfoModalOpen = (
    post: Post
    // likes: Like[],
    // comments: CommentArray,
    // savedPostsId: {
    //   postId: string;
    // }[],
    // restrictedUsers: Restrict[]
  ) => {
    if (isSmallScreen) {
      router.push(`/post/${post.id}`);
    } else {
      onOpen(
        "postInfo",
        post
        //   likes, comments, savedPostsId, restrictedUsers
      );
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div
          onClick={() =>
            onPostInfoModalOpen(
              post
              //   likes,
              //   comments,
              //   savedPostsId,
              //   restrictedUsers
            )
          }
          className="group relative h-[12rem]"
          key={post.id}
        >
          <div className="">
            <CldImage
              src={post.imageUrl}
              alt="Posts"
              crop="fill"
              width="300"
              height="300"
              className="cursor-pointer hover:brightness-75"
              sharpen={60}
              priority
            />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 pointer-events-none">
            {!post.hideLikes && (
              <div className="flex gap-2 items-center">
                <Heart className="text-white h-5 w-5" fill="white" />
                <span className="text-lg text-white font-semibold">
                  {post._count.likes}
                </span>
              </div>
            )}
            {!post.hideComments && (
              <div className="flex gap-2 items-center">
                <MessageCircle className="text-white h-5 w-5" fill="white" />
                <span className="text-lg text-white font-semibold">
                  {post._count.comments}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
