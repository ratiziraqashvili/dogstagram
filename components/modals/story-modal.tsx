import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { Story } from "@prisma/client";

export const StoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const story: Story[] = data;

  const isModalOpen = isOpen && type === "story";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-gradient-to-t from-black to-zinc-400">
        <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0"></DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
