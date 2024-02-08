import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent } from "../ui/dialog";
import { CldImage } from "next-cloudinary";
import { ProfilePicture } from "../profile-picture";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { CommentSection } from "../comment-section";
import { PostInput } from "../post-input";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { SinglePost } from "@/types";

export const PostInfoModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { onOpen } = useSecondModal();

  const post: SinglePost = data;

  const isModalOpen = isOpen && type === "postInfo";

  const onPostPropertiesModalOpen = () => {
    onOpen("postProperties", post);
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="lg:h-[90%] h-[83%] md:w-[80%] w-[60%] rounded-sm p-0 flex flex-col gap-0 md:flex-row border-0 overflow-y-auto">
        <div className="flex md:hidden justify-between items-center py-5 px-3">
          <div className="flex items-center gap-2">
            <ProfilePicture
              className="w-7 h-7"
              imageUrl={post?.user.imageUrl}
            />
            <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
              {post?.user.username}
            </span>
          </div>
          <div>
            <Button className="p-0 hover:text-black" variant="ghost">
              <MoreHorizontal onClick={onPostPropertiesModalOpen} className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="aspect-auto z-50 bg-black flex items-center md:overflow-hidden">
          <CldImage
            src={post?.imageUrl}
            alt="Image"
            width="600"
            height="664"
            crop="fill"
            className="object-cover md:min-w-24"
            priority
          />
        </div>
        <div className="md:min-w-[10rem] w-full max-w-[39.2rem]  flex flex-col">
          <div className="md:flex hidden items-center justify-between  gap-2 py-5 px-3">
            <div className="flex items-center gap-3">
              <ProfilePicture
                className="h-7 w-7"
                imageUrl={post?.user.imageUrl}
              />
              <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
                {post?.user.username}
              </span>
            </div>
            <div>
              <Button className="hover:text-muted-foreground p-0" variant="ghost">
                <MoreHorizontal onClick={onPostPropertiesModalOpen} className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 order-2 md:order-1">
            <CommentSection post={post} />
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-4">
            <PostInput post={post} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
