import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { CldImage } from "next-cloudinary";
import { ProfilePicture } from "../profile-picture";
import { Post } from "@prisma/client";

export const PostInfoModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const post: Post & {
    _count: {
      likes: number;
      comments: number;
    };
    user: {
      imageUrl: string | null;
      username: string | null;
      firstName: string | null;
    };
  } = data;

  const isModalOpen = isOpen && type === "postInfo";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="lg:h-[90%] h-[63%] md:w-[80%] w-[60%] rounded-sm p-0 flex flex-col md:flex-row border-0">
        <div className="flex md:hidden"></div>
        <div className="aspect-auto z-50 bg-black flex items-center overflow-hidden">
          <CldImage
            src={post?.imageUrl}
            alt="Image"
            width="600"
            height="664"
            crop="fill"
            className="object-cover md:min-w-24"
          />
        </div>
        <div className="md:min-w-[24rem]">
          <div className="p-4 pl-0">
            <ProfilePicture imageUrl={post?.user.imageUrl} />
            <span className="text-sm font-semibold">{post?.user.username}</span>
            <span className="text-sm text-muted-foreground">{post?.user.firstName}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
