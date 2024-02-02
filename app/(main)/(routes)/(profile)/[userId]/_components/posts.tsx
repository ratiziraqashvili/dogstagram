import { Post } from "@prisma/client";
import { CldImage } from "next-cloudinary";

interface PostsProps {
  posts: Post[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <div className="flex gap-1 justify-center">
      {posts.map((post) => (
        <div key={post.id} className="">
            <CldImage
              src={post.imageUrl}
              alt="Posts"
              crop="fill"
              width="300"
              height="300"
              className="cursor-pointer hover:brightness-75"
            />
        </div>
      ))}
    </div>
  );
};
