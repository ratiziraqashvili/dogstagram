import { SinglePost } from "@/types";
import { Comment } from "@prisma/client";

interface CommentSectionProps {
    post: SinglePost;
    comments: Comment[] | undefined;
}

export const CommentSection = ({ post, comments }: CommentSectionProps) => {
  const filteredComments = comments?.filter(comment => comment.postId === post.id)

  if (post.hideComments) {
    return (
      <div className="flex justify-center items-center h-full md:border-t-[1px]">
      <div className="flex flex-col gap-1.5">
          <h1 className="font-bold text-2xl">Comments is turned off.</h1>
          <span className="text-center text-sm">Wait before post author turns on commenting.</span>
      </div>
    </div>
    )
  }

  if (filteredComments?.length === 0) {
    return (
      <div className="flex justify-center items-center h-full md:border-t-[1px]">
        <div className="flex flex-col gap-1.5">
            <h1 className="font-bold text-2xl">No comments yet.</h1>
            <span className="text-center text-sm">Start the conversation.</span>
        </div>
      </div>
    )
  }

    return (
        <div className="md:border-t-[1px]">
            comment
        </div>
    )
}