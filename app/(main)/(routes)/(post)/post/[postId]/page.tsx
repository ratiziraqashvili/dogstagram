import { db } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Post } from "../_components/post";
import { currentUser } from "@clerk/nextjs";

const PostPage = async ({ params }: { params: { postId: string } }) => {
  const user = await currentUser();
  const { postId } = params;

  const post = await db.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      user: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
    },
  });

  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const restrictedUsers = await db.restrict.findMany({
    where: {
      userId: post?.userId,
    },
  });

  const isLiked = await db.like.findFirst({
    where: {
      userId: user?.id,
      postId: post!.id,
    },
  });

  const isFavorited = await db.savedPosts.findFirst({
    where: {
      savedUserId: user?.id,
      postId: post!.id,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem]">
        <div className="pl-1">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </div>
        <div className="">
          <p className="font-semibold">Post</p>
        </div>
        {/* added empty div to push notification in center */}
        <div className="w-[2.9rem]" />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full md:p-3">
        <div className="rounded-sm p-0 flex flex-col gap-0 md:flex-row overflow-y-auto w-full md:h-[80%] md:w-[60%] h-full lg:pl-20">
          <Post
            isFavorited={!!isFavorited}
            isLiked={!!isLiked}
            restrictedUsers={restrictedUsers}
            comments={comments}
            post={post}
          />
        </div>
      </div>
    </>
  );
};

export default PostPage;
