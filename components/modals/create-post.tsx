import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent } from "../ui/dialog";

export const CreatePost = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "createPost";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] pt-3 pb-0 px-0">
        create post
      </DialogContent>
    </Dialog>
  );
};
