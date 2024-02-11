import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

export const CommentDeleteModal = () => {
  const { isOpen, onClose, type, data } = useSecondModal();
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const comment: Record<string, string> = data;
  const isModalOpen = isOpen && type === "commentDelete";

  const handleClose = () => {
    onClose();
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      if (userId === comment.authorId) {
        const url = qs.stringifyUrl({
          url: "/api/comment/delete",
          query: {
            commentId: comment.id,
            authorId: comment.authorId,
          },
        });

        await axios.delete(url);
        router.refresh();
      } else {
        return toast({
          title: "Unable to delete comment",
          variant: "default",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(
        "error in client [COMPONENTS_MODALS_COMMENT-DELETE-MODAL]",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          <button
            disabled={isLoading}
            onClick={onDelete}
            className="hover:bg-primary/10 w-full py-3 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px] text-red-600 font-bold opacity-85"
          >
            Delete
          </button>
        </div>
        <DialogClose>
          <div className="hover:bg-primary/10 py-3 flex justify-center text-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 w-full items-center">
            <span>Cancel</span>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
