"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useClerk } from "@clerk/nextjs";

export const SettingsModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { signOut } = useClerk();

  const isModalOpen = isOpen && type === "settings";

  const handleClose = () => {
    onClose();
  };

  const buttons = [
    { label: "Notifications", onClick: () => {} },
    //TODO: Redirect to notifications page
    { label: "Log Out", onClick: () => signOut() },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full mt-3">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={button.onClick}
              className="hover:bg-primary/10 py-3 flex justify-between p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50"
            >
              {button.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
