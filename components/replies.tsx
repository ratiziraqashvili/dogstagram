import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface RepliesProps {
  replyCount: number;
  onClick: () => void;
  isReplyVisible: boolean;
  reply: {
    content: string;
    user: { username: string; imageUrl: string | null };
    replyAuthorUsername: string;
    replyAuthorId: string;
  }[];
}

export const Replies = ({
  replyCount,
  onClick,
  isReplyVisible,
  reply,
}: RepliesProps) => {
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
            {reply.map((r, i) => (
                <div key={i}>
                    
                </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
