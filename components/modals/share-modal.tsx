import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent } from "../ui/dialog";
import { Clipboard, ClipboardCheck } from "lucide-react";
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
