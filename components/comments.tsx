import { ProfilePicture } from "./profile-picture";
import { CommentArray } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { MoreHorizontal, SendHorizonal } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { useModal } from "@/hooks/use-modal-store";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import qs from "query-string";
import axios from "axios";
import { EmojiPicker } from "./emoji-pickers";
import { cn } from "@/lib/utils";
import { Replies } from "./replies";
import { useRouter } from "next/navigation";

interface CommentsProps {
  comments: CommentArray;
  authorId: string;
  postId: string | undefined;
}

export const Comments = ({ comments, authorId, postId }: CommentsProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyStates, setReplyStates] = useState<{
    [commentId: string]: boolean;
  }>({});
  const [replyingToId, setReplyingToId] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { userId } = useAuth();
  const { onOpen } = useSecondModal();
  const { onClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  const handleClose = () => {
    onClose();
  };

  const toggleReplyState = (commentId: string) => {
    setReplyStates((prevStates) => ({
      ...prevStates,
      [commentId]: !prevStates[commentId],
    }));
  };

  const onReply = (id: string, username: string) => {
    inputRef.current?.focus();
    setReplyingToId(id);
    setIsReplying((prev) => !prev);
    setCommentValue("@" + username + " ");
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value);
  };

  const MAX_REPLY_LENGTH = 150;

  const onReplySubmit = async (
    username: string,
    commentId: string,
    authorId: string
  ) => {
    let newValue = commentValue;
    // check if the comment value starts with "@username"
    if (newValue.startsWith("@" + username)) {
      // remove the username from the comment value
      newValue = newValue.slice(username.length + 1).trim();
    }
    // here, newValue contains the comment value without the username part
    setIsSubmitting(true);
    try {
      if (!!commentValue) {
        if (newValue.length > MAX_REPLY_LENGTH) {
          toast({
            title: "Comment should not be more than 150 characters.",
            variant: "default",
            duration: 3000,
          });
          return;
        }

        const url = qs.stringifyUrl({
          url: "/api/comment/reply",
          query: {
            content: newValue,
            recipient: authorId,
            postId,
            username,
            commentId,
          },
        });

        await axios.post(url);
        router.refresh();
      } else return;
    } catch (error: any) {
      console.error("error in client [COMPONENTS_COMMENTS]", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
      setReplyingToId("");
      setIsReplying(false);
      setCommentValue("");
    }
  };

  const getFormattedtime = (createdAt: Date) => {
    return formatTimeDifference(createdAt);
  };

  const onCommentDeleteModalOpen = (commentId: string, authorId: string) => {
    const data = {
      commentId,
      authorId,
      type: "comment",
    };
    onOpen("commentDelete", data);
  };

  return (
    <>
      {comments?.map((comment) => {
        return (
          <div key={comment.id}>
            <div className="flex gap-3 p-3">
              <div>
                <Link onClick={handleClose} href={`/${comment.userId}`}>
                  <ProfilePicture
                    className="w-8 h-8 cursor-pointer"
                    imageUrl={comment.user.imageUrl}
                  />
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 group/comment">
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 group/comment">
                    <span className="text-xs text-muted-foreground cursor-pointer">
                      {getFormattedtime(comment.createdAt)}
                    </span>
                    <span
                      onClick={() =>
                        onReply(comment.id, comment.user.username!)
                      }
                      className="text-xs text-muted-foreground cursor-pointer font-semibold"
                    >
                      Reply
                    </span>
                    {userId === comment.userId && (
                      <button>
                        <MoreHorizontal
                          onClick={() =>
                            onCommentDeleteModalOpen(comment.id, comment.userId)
                          }
                          className="h-5 w-5 text-muted-foreground pt-1 opacity-0 group-hover/comment:opacity-100 group-hover/reply:opacity-0"
                        />
                      </button>
                    )}
                  </div>
                  {comment.reply.length > 0 && (
                    <Replies
                      reply={comment.reply}
                      isReplyVisible={replyStates[comment.id]}
                      onClick={() => toggleReplyState(comment.id)}
                      replyCount={comment.reply.length}
                    />
                  )}
                </div>
              </div>
            </div>
            {replyingToId === comment.id && isReplying && (
              <>
                <div className="relative w-[60%] ml-16">
                  <Input
                    disabled={isSubmitting}
                    ref={inputRef}
                    className="text-sm pr-14"
                    onChange={(e) => onInputChange(e)}
                    value={commentValue}
                  />
                  <EmojiPicker
                    className={cn(
                      "absolute right-8 top-[0.625rem] cursor-pointer size-5 text-muted-foreground hover:opacity-80 transition",
                      isSubmitting &&
                        "cursor-not-allowed opacity-50 hover:opacity-50"
                    )}
                    onChange={(value) => setCommentValue(commentValue + value)}
                  />
                  <SendHorizonal
                    onClick={
                      !isSubmitting
                        ? () =>
                            onReplySubmit(
                              comment.user.username!,
                              comment.id,
                              comment.userId
                            )
                        : () => {}
                    }
                    className={cn(
                      "absolute right-2 top-[0.625rem] cursor-pointer size-5 text-muted-foreground hover:opacity-80 transition",
                      isSubmitting &&
                        "cursor-not-allowed opacity-50 hover:opacity-50"
                    )}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};
