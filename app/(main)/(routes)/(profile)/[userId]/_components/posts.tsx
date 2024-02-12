import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import { cn } from "@/lib/utils";
import { CommentArray, PostInfoType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { Like, Post } from "@prisma/client";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useParams } from "next/navigation";

interface PostsProps {
  posts: PostInfoType;
  likes: Like[];
  comments: CommentArray;
}

export const Posts = ({ posts, likes, comments }: PostsProps) => {
  const { onOpen } = useModal();
  const { toast } = useToast();
  const { addUploadedData } = usePostDataStore();
  const { userId } = useAuth();
  const params = useParams();

  const onCreatePostModalOpen = () => {
    onOpen("createPost");
  };

  const onUpload = (result: any, widget: any) => {
    widget.close();

    // Get file type from result
    const { resource_type } = result.info;

    // Check if file is an image
    if (resource_type !== "image") {
      // Handle invalid file type
      toast({
        title: "Make sure that uploaded file is valid image.",
        variant: "default",
        duration: 3000,
      });
      return;
    }

    addUploadedData(result);

    onCreatePostModalOpen();
  };

  if (posts.length === 0 && userId === params.userId) {
    return (
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="fcbztrpi"
        options={{
          maxFiles: 1,
        }}
      >
        {({ open }) => (
          <div className="flex justify-center items-center pt-20">
            <div className="flex flex-col justify-center gap-3">
              <Camera
                onClick={() => open?.()}
                strokeWidth="1px"
                className="mx-auto h-14 w-14 cursor-pointer text-[#646464]"
              />
              <h1 className="font-bold text-3xl text-center">Share Photos</h1>
              <p className="text-sm">
                When you share photos, they will appear on your profile.
              </p>
              <Button
                onClick={() => open?.()}
                className="text-amber-600 p-0"
                variant="ghost"
              >
                Share your first photo
              </Button>
            </div>
          </div>
        )}
      </CldUploadWidget>
    );
  }

  if (posts.length === 0 && userId !== params.userId) {
    return (
      <div className="flex justify-center items-center pt-20">
        <div className="flex flex-col justify-center gap-3">
          <Camera
            strokeWidth="1px"
            className="mx-auto h-14 w-14 text-[#646464]"
          />
          <h1 className="font-bold text-3xl text-center">No Posts Yet</h1>
        </div>
      </div>
    );
  }

  const onPostInfoModalOpen = (
    post: Post,
    likes: Like[],
    comments: CommentArray
  ) => {
    onOpen("postInfo", post, likes, comments);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-1",
        posts.length < 3 && "justify-start"
      )}
    >
      {posts.map((post) => (
        <div
          onClick={() => onPostInfoModalOpen(post, likes, comments)}
          className="group relative"
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
            <div className="flex gap-2 items-center">
              <Heart className="text-white h-5 w-5" fill="white" />
              <span className="text-lg text-white font-semibold">
                {post._count.likes}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <MessageCircle className="text-white h-5 w-5" fill="white" />
              <span className="text-lg text-white font-semibold">
                {post._count.comments}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
