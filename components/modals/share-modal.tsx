import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Clipboard, X } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { useToast } from "../ui/use-toast";

export const ShareModal = () => {
  const params = useParams();
  const { isOpen, onClose, type } = useModal();
  const origin = useOrigin();
  const { toast } = useToast();

  const isModalOpen = isOpen && type === "shareTo";

  const profileId = params.userId;
  const profileUrl = `${origin}/${profileId}`;

  const handleClose = () => {
    onClose();
  };

  const onCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied to clipboard.",
      variant: "default",
    });

    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <DialogClose>
          <X className="w-5 h-5 absolute right-4 top-2.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
        </DialogClose>
        <div className="flex justify-center items-center py-3 border-b-[1px]">
          <h1 className="font-semibold font-lg">Share to...</h1>
        </div>
        <div
          onClick={onCopy}
          className="flex p-5 gap-2 hover:bg-primary/5 cursor-pointer"
        >
          <Clipboard />
          <span className="text-sm">Copy link</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
