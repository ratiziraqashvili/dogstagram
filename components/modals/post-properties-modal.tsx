import { Post } from "@prisma/client";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export const PostPropertiesModal = () => {
  const { isOpen, onClose, type, data } = useSecondModal();
  const post: Post & {
    _count: {
      likes: number;
      comments: number;
    };
    user: {
      imageUrl: string | null;
      username: string | null;
    };
  } = data;
  const { userId } = useAuth();

  const isModalOpen = isOpen && type === "postProperties";

  const handleClose = () => {
    onClose();
  };

  const isAuthor = post?.userId === userId;

  const buttons = [
    isAuthor ? { label: "Delete", onClick: () => {} } : null,
    isAuthor ? { label: "Edit", onClick: () => {} } : null,
    isAuthor
      ? {
          label: post.hideLikes
            ? "Unhide like count to others"
            : "Hide like count to others",
          onClick: () => {},
        }
      : null,
    isAuthor
      ? {
          label: post.hideComments
            ? "Turn on commenting"
            : "Turn off commenting",
          onClick: () => {},
        }
      : null,
    { label: "Go to post", onClick: () => {} },
    { label: "Copy link", onClick: () => {} },
    { label: "About this account", onClick: () => {} },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          {buttons.filter(Boolean).map((button, i) => (
            <button
              key={i}
              onClick={button!.onClick}
              className="hover:bg-primary/10 w-full py-3.5 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px]"
            >
              <span className={cn(button!.label === "Delete" && "font-bold text-red-600 opacity-85")}>{button!.label}</span>
            </button>
          ))}
        </div>
        <DialogClose>
          <span className="hover:bg-primary/10 py-3 flex justify-center text-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 w-full items-center">
            Cancel
          </span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
