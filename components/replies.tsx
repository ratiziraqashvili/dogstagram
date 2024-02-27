import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useModal } from "@/hooks/use-modal-store";
import { ProfilePicture } from "./profile-picture";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { formatTimeDifference } from "@/lib/timeUtils";
import { useSecondModal } from "@/hooks/use-second-modal-store";

interface RepliesProps {
  replyCount: number;
  onClick: () => void;
  isReplyVisible: boolean;
  reply: {
    content: string;
    user: { username: string; imageUrl: string | null };
    replyAuthorUsername: string;
    replyAuthorId: string;
    userId: string;
    createdAt: Date;
    id: string;
  }[];
}

export const Replies = ({
  replyCount,
  onClick,
  isReplyVisible,
  reply,
}: RepliesProps) => {
  const { onClose } = useModal();
  const { onOpen } = useSecondModal();
  const { userId } = useAuth();

  const handleClose = () => {
    onClose();
  };

  const getFormattedtime = (createdAt: Date) => {
    return formatTimeDifference(createdAt);
  };

  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <span
            onClick={onClick}
            className="text-xs text-muted-foreground font-semibold cursor-pointer"
          >
            {isReplyVisible ? "Hide replies" : `View replies (${replyCount})`}
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {reply.map((r, i) => {
            const data = {
              replyId: r.id,
              authorId: r.userId,
            };
            const onCommentDeleteModalOpen = () => {
              onOpen("commentDelete", data);
            };

            return (
              <div className="flex gap-3" key={i}>
                <div>
                  <Link onClick={handleClose} href={`/${r.userId}`}>
                    <ProfilePicture
                      className="w-8 h-8 cursor-pointer"
                      imageUrl={r.user.imageUrl}
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1">
                    {/* <Link onClick={handleClose} href={`/${comment.userId}`}>
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
                        <span>{r.user.username}</span>
                      )}
                    </h1>
                  </Link> */}
                    <span className="text-sm break-all">{r.content}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground cursor-pointer">
                        {getFormattedtime(r.createdAt)}
                      </span>
                      {userId === r.userId && (
                        <button>
                          <MoreHorizontal
                            onClick={() => {}}
                            className="h-5 w-5 text-muted-foreground pt-1 opacity-0 group-hover:opacity-100"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
