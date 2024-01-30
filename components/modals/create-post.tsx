import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { ProfilePicture } from "../profile-picture";

const formSchema = z.object({
  caption: z.string().max(2200, {
    message: "Caption should contain less that 2200 characters.",
  }),
  location: z.string().max(40, {
    message: "Location is too long.",
  }),
});

export const CreatePostModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { uploadedData } = usePostDataStore();
  const storedData = localStorage.getItem("uploadedData");
  const data = storedData ? JSON.parse(storedData) : uploadedData;
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      location: "",
    },
  });

  const isModalOpen = isOpen && type === "createPost";

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 w-10 sm:w-[55rem]">
        <div className="flex justify-between items-center border-b-[1px]">
          <DialogClose className="pl-1">
            <X className="w-5 h-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
          </DialogClose>
          <h1 className="font-semibold font-lg pl-5 md:pl-14">Share to...</h1>
          <Button className="text-amber-600 p-3" variant="ghost">
            Share
          </Button>
        </div>
        <div className="flex">
          <div>
            <Image
              src={uploadedData?.info?.secure_url || data?.info?.secure_url}
              alt="Image"
              height={500}
              width={500}
            />
          </div>
          <div className="flex flex-col">
              <div className="flex items-center p-3 gap-3">
                  <ProfilePicture className="w-8 h-8" />
                  <span className="font-semibold text-sm">{user?.username}</span>
              </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
