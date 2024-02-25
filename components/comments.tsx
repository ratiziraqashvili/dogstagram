import { ProfilePicture } from "./profile-picture";
import { CommentArray } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { useModal } from "@/hooks/use-modal-store";
import Link from "next/link";
import { useRef, useState } from "react";
import { Input } from "./ui/input";

interface CommentsProps {
  comments: CommentArray;
  authorId: string;
}

export const Comments = ({ comments, authorId }: CommentsProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyingToId, setReplyingToId] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [username, setUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { userId } = useAuth();
  const { onOpen } = useSecondModal();
  const { onClose } = useModal();

  const handleClose = () => {
    onClose();
  };

  const onReply = (id: string, username: string) => {
    inputRef.current?.focus();
    setReplyingToId(id);
    setIsReplying((prev) => !prev);
    setUsername("@" + username + " ");
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(username, "");
    setCommentValue(newValue);
  };

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
          <>
            <div key={comment.id} className="flex gap-3 p-3 items-center group">
              <div>
                <Link onClick={handleClose} href={`/${comment.userId}`}>
                  <ProfilePicture
                    className="w-8 h-8 cursor-pointer"
                    imageUrl={comment.user.imageUrl}
                  />
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <Link onClick={handleClose} href={`/${comment.userId}`}>
                    <h1 className="font-semibold text-sm hover:text-muted-foreground cursor-pointer flex">
                      {authorId === comment.userId ? (
                        <span className="flex items-center gap-2">
                          <span>{comment.user.username}</span>
                          &bull;
                          <span className="text-amber-500 text-xs">
                            Creator
                          </span>
                        </span>
                      ) : (
                        <span>{comment.user.username}</span>
                      )}
                    </h1>
                  </Link>
                  <span className="text-sm break-all">{comment.content}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground cursor-pointer">
                    {formattedTime}
                  </span>
                  <span
                    onClick={() => onReply(comment.id, comment.user.username!)}
                    className="text-xs text-muted-foreground cursor-pointer font-semibold"
                  >
                    Reply
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
            {replyingToId === comment.id && isReplying && (
              <>
                <div className="relative w-[60%] ml-16">
                  <Input
                    ref={inputRef}
                    className="text-sm"
                    onChange={(e) => onInputChange(e)}
                    value={username + commentValue}
                  />
                </div>
              </>
            )}
          </>
        );
      })}
    </>
  );
};
