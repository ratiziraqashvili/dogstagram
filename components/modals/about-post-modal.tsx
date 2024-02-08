import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { CalendarDays, MapPin } from "lucide-react";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { SinglePost } from "@/types";

export const AboutPostModal = () => {
  const { isOpen, onClose, type, data } = useSecondModal();

  const post: SinglePost = data;

  const isModalOpen = isOpen && type === "aboutPost";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] py-3 px-0">
        <div className="flex flex-col">
          <div className="flex justify-center border-b-[1px] pb-[0.580rem]">
            <h1 className="font-semibold">About this post</h1>
          </div>
          <div className="pt-3 pb-8">
            <div className="flex flex-col justify-center items-center">
              <span className="font-semibold pt-2.5">{post?.caption || "No caption"}</span>
              <p className="text-xs text-muted-foreground w-[80%] text-center pt-2">
                To help keep our community authentic, we&apos;re showing
                information about accounts on Dogstagram.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-7 px-4 pb-4 border-b-[1px]">
            <div className="flex items-center gap-3.5">
              <CalendarDays className="w-7 h-7" />
              <div className="flex flex-col">
                <span>Created at</span>
                <span className="text-muted-foreground text-sm">
                  {post?.createdAt
                    ? new Date(post.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        timeZoneName: "short",
                      })
                    : null}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <MapPin className="w-7 h-7" />
              <div className="flex flex-col">
                <span>Post location</span>
                <span className="text-muted-foreground text-sm">
                  {post?.location || "Unspecified"}
                </span>
              </div>
            </div>
          </div>
          <DialogClose>
            <div className="flex justify-center items-center">
              <div className="hover:text-black font-normal pt-3">
                <span className="text-sm">Close</span>
              </div>
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
