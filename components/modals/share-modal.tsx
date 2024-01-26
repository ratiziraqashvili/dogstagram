import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent } from "../ui/dialog";
import { Clipboard } from "lucide-react";

export const ShareModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();

  const isModalOpen = isOpen && type === "shareTo";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex justify-center items-center py-3 border-b-[1px]">
          <h1 className="font-semibold font-lg">Share to...</h1>
        </div>
        <div className="flex p-5 gap-2 hover:bg-primary/5 cursor-pointer">
          <Clipboard />
          <span>Copy link</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
