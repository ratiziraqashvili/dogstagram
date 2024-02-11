import { ProfilePicture } from "./profile-picture";
import { CommentArray } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useSecondModal } from "@/hooks/use-second-modal-store";

interface CommentsProps {
  comments: CommentArray;
}

export const Comments = ({ comments }: CommentsProps) => {
  const { userId } = useAuth();
  const { onOpen } = useSecondModal();

  return (
    <>
      {comments?.map((comment) => {
        const formattedTime = formatTimeDifference(comment.createdAt);
        const data = {
          commentId: comment.id,
          authorId: comment.userId,
        };
        const onCommentDeleteModalOpen = () => {
          onOpen("commentDelete", data);
        };

        return (
          <div key={comment.id} className="flex gap-3 p-3 items-center group">
            <div>
              <ProfilePicture
                className="w-8 h-8 cursor-pointer"
                imageUrl={comment.user.imageUrl}
              />
            </div>
            <div className="flex flex-col gap-1">
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
                {userId === comment.userId && (
                  <button>
                    <MoreHorizontal
                      onClick={onCommentDeleteModalOpen}
                      className="h-5 w-5 text-muted-foreground pt-1 opacity-0 group-hover:opacity-100"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
