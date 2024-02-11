import { ProfilePicture } from "./profile-picture";
import { CommentArray, SinglePost } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal } from "lucide-react";

interface CommentsProps {
  comments: CommentArray;
  post: SinglePost;
}

export const Comments = ({ comments, post }: CommentsProps) => {
  const formattedTime = comments?.map((comment) => {
    return formatTimeDifference(comment.createdAt);
  });

  console.log(formattedTime);

  return (
    <>
      {comments?.map((comment) => (
        <div className="flex gap-3 p-3 items-center group">
          <div>
            <ProfilePicture
              className="w-8 h-8 cursor-pointer"
              imageUrl={comment.user.imageUrl}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h1 className="font-semibold text-sm hover:text-muted-foreground cursor-pointer">
                {comment.user.username}
              </h1>
              <span className="text-sm">{comment.content}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground cursor-pointer">
                {formattedTime}
              </span>
              <button>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground pt-1 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
