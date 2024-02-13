import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { CommentArray, PostInfoType } from "@/types";
import { Like, Post } from "@prisma/client";
import { Heart, MessageCircle } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface SavedPostsProps {
  savedPosts: PostInfoType;
  likes: Like[];
  comments: CommentArray;
  savedPostsId: {
    postId: string;
  }[];
}

export const SavedPosts = ({
  savedPosts,
  likes,
  comments,
  savedPostsId,
}: SavedPostsProps) => {
  const { onOpen } = useModal();

  const onPostInfoModalOpen = (
    post: Post,
    likes: Like[],
    comments: CommentArray,
    savedPostsId: { postId: string }[]
  ) => {
    onOpen("postInfo", post, likes, comments, savedPostsId);
  };

  if (savedPosts.length === 0) {
    return (
      <div className="flex justify-center items-center sm:h-[25rem] h-[17rem]">
        <h1 className="text-xl font-bold text-center">
          There are no saved posts to show.
        </h1>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-1",
        savedPosts.length < 3 && "justify-start"
      )}
    >
      {savedPosts.map((savedPost) => (
        <div
          onClick={() =>
            onPostInfoModalOpen(savedPost, likes, comments, savedPostsId)
          }
          className="group relative"
          key={savedPost.id}
        >
          <div className="">
            <CldImage
              src={savedPost.imageUrl}
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
            <div className="flex gap-2 items-center">
              <Heart className="text-white h-5 w-5" fill="white" />
              <span className="text-lg text-white font-semibold">
                {savedPost._count.likes}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <MessageCircle className="text-white h-5 w-5" fill="white" />
              <span className="text-lg text-white font-semibold">
                {savedPost._count.comments}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
