import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import Image from "next/image";

export const CreatePostModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { uploadedData } = usePostDataStore();

  console.log(uploadedData)

  const isModalOpen = isOpen && type === "createPost";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0">
        <DialogClose>
          <X className="w-5 h-5 absolute right-4 top-2.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
        </DialogClose>
          <Image
           src={uploadedData?.info?.secure_url || null}
           fill
           alt="Image"
          />
      </DialogContent>
    </Dialog>
  );
};
