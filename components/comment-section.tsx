import { CommentArray, SinglePost } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { Comments } from "./comments";

interface CommentSectionProps {
  post: SinglePost;
  comments: CommentArray;
  formattedTime: string;
}

export const CommentSection = ({ post, comments, formattedTime }: CommentSectionProps) => {
  const filteredComments = comments?.filter(
    (comment) => comment.postId === post.id
  );

  if (post.hideComments) {
    return (
      <div className="flex justify-center items-center h-full md:border-t-[1px]">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-bold text-2xl">Comments is turned off.</h1>
          <span className="text-center text-sm">
            Wait before post author turns on commenting.
          </span>
        </div>
      </div>
    );
  }

  if (filteredComments?.length === 0 && !post.caption) {
    return (
      <div className="flex justify-center items-center h-full md:border-t-[1px]">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-bold text-2xl">No comments yet.</h1>
          <span className="text-center text-sm">Start the conversation.</span>
        </div>
      </div>
    );
  }

  if (filteredComments?.length! > 0 && !post.caption) {
    return (
      <div className="md:border-t-[1px]">
        <Comments post={post} comments={filteredComments} />
      </div>
    )
  }

  if (post.caption) {
    return (
      <div className="md:border-t-[1px]">
        <div className="flex gap-3 p-3 items-center">
          <div>
            <ProfilePicture className="w-8 h-8" imageUrl={post.user.imageUrl} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h1 className="font-semibold text-sm hover:text-muted-foreground cursor-pointer">
                {post.user.username}
              </h1>
              <span className="text-sm">{post.caption}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>
        <Comments post={post} comments={filteredComments} />
      </div>
    );
  }
};
