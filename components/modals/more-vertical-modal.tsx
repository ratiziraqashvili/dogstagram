"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { cn } from "@/lib/utils";

export const MoreHorizontalModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "moreHorizontal";

  const handleClose = () => {
    onClose();
  };

  const buttons = [
    //TODO: Block account
    { label: "Block", onClick: () => {} },
    //TODO: Redirect to notifications page
    { label: "Share to...", onClick: () => {} },
    //TODO: Create about this account modal
    { label: "About this account", onClick: () => {} },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={button.onClick}
              className={cn(
                "hover:bg-primary/10 w-full py-3 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px]",
                button.label === "Block" && "text-red-600 font-bold"
                )}
            >
              <span>{button.label}</span>
            </button>
          ))}
        </div>
        <DialogClose>
          <button className="hover:bg-primary/10 py-3 flex justify-center text-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 w-full items-center">
            <span>Cancel</span>
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
