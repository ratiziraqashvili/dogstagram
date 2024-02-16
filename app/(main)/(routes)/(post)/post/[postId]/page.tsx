import { db } from "@/lib/db";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Post } from "../_components/post";

const PostPage = async ({ params }: { params: { postId: string } }) => {
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
          following: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("coms:",comments);

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
      <div className="flex flex-col max-w-xl md:max-w-xl md:pt-0 pt-9 mx-auto p-3">
        <div className="lg:h-[90%] h-[83%] md:w-[80%] w-[60%] rounded-sm p-0 flex flex-col gap-0 md:flex-row border-0 overflow-y-auto">
          <Post post={post} />
        </div>
      </div>
    </>
  );
};

export default PostPage;
