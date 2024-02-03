import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { CldImage } from "next-cloudinary";

interface PostsProps {
  posts: (Post & {
    _count: {
      likes: number;
      comments: number;
    };
  })[];
}

export const Posts = ({ posts }: PostsProps) => {
  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center pt-20">
        <div className="flex flex-col justify-center">
          <Camera strokeWidth="1px" className="mx-auto h-14 w-14" />
          <h1 className="font-bold text-3xl text-center">Share Photos</h1>
          <p>When you share photos, they will appear on your profile.</p>
          <Button className="text-amber-600 p-0" variant="ghost">
            Share your first photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-1",
        posts.length < 3 && "justify-start"
      )}
    >
      {posts.map((post) => (
        <div className="group relative" key={post.id}>
          <div className="">
            <CldImage
              src={post.imageUrl}
              alt="Posts"
              crop="fill"
              width="300"
              height="300"
              className="cursor-pointer hover:brightness-75"
              sharpen={60}
            />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-10 opacity-0 group-hover:opacity-100 pointer-events-none">
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
