import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const SettingsModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();
  const { signOut } = useClerk();
  const router = useRouter();

  const isModalOpen = isOpen && type === "settings";

  const handleClose = () => {
    onClose();
  };

  const redirectToNotiPage = () => {
    handleClose();
    router.push("/notifications");
  };

  const onShareModalOpen = () => {
    onOpen("shareTo");
  };

  const buttons = [
    { label: "Notifications", onClick: redirectToNotiPage },
    { label: "Share to...", onClick: onShareModalOpen },
    { label: "Log Out", onClick: () => signOut() },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={button.onClick}
              className="hover:bg-primary/10 w-full py-3.5 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px]"
            >
              <span>{button.label}</span>
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
