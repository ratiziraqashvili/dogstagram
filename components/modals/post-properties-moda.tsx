import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";

export const PostPropertiesModal = () => {
  const { isOpen, onClose, type, data } = useSecondModal();

  const isModalOpen = isOpen && type === "postProperties";

  const handleClose = () => {
    onClose();
  };

  const buttons = [
    { label: "Notifications", onClick: () => {} },
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
