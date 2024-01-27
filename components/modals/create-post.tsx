import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Image, X } from "lucide-react";
import { Button } from "../ui/button";

export const CreatePost = () => {
  const { isOpen, onClose, type } = useModal();

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
        <div className="flex justify-center p-2 border-b-[1px]">
            <h1 className="text-md font-semibold">Create new post</h1>
        </div>
        <div className="flex flex-col justify-center items-center w-full h-full gap-4 py-28">
            <Image
             strokeWidth={0.7}
             className="w-20 h-20"
            />
            <h1 className="text-xl">Post photos from here</h1>
            <Button className="h-[2rem]" variant="amber">
                Select from computer
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
