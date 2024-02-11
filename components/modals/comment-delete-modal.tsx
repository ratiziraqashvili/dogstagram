import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";

export const CommentDeleteModal = () => {
  const { isOpen, onClose, type, data } = useSecondModal();

  const commentId: string = data;
  const isModalOpen = isOpen && type === "commentDelete";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          <button className="hover:bg-primary/10 w-full py-3 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px] text-red-600 font-bold opacity-85">
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
