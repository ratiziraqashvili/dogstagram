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
import { formatTimeDifference } from "@/lib/timeUtils";
import Link from "next/link";

export const PostInfoModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data,
    likes,
    comments,
    savedPostsId: id,
  } = useModal();
  const { onOpen } = useSecondModal();

  const post: SinglePost = data;
  const formattedTime = formatTimeDifference(post?.createdAt);

  const isModalOpen = isOpen && type === "postInfo";

  const likePostIds = likes?.map((like) => like.postId);
  const isLiked = likePostIds?.includes(post.id);
  const savedPostsId = id?.map((savePostId) => savePostId.postId);
  const isFavorited = savedPostsId?.includes(post.id);

  const onPostPropertiesModalOpen = () => {
    onOpen("postProperties", post);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="lg:h-[90%] h-[83%] md:w-[80%] w-[60%] rounded-sm p-0 flex flex-col gap-0 md:flex-row border-0 overflow-y-auto">
        <div className="flex md:hidden justify-between items-center py-5 px-3">
          <div className="flex items-center gap-2">
            <Link onClick={handleClose} href={`/${post?.userId}`}>
              <ProfilePicture
                className="w-8 h-8 cursor-pointer"
                imageUrl={post?.user.imageUrl}
              />
            </Link>
            <Link onClick={handleClose} href={`/${post?.userId}`}>
              <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
                {post?.user.username}
              </span>
            </Link>
          </div>
          <div>
            <Button className="p-0 hover:text-black" variant="ghost">
              <MoreHorizontal
                onClick={onPostPropertiesModalOpen}
                className="h-5 w-5"
              />
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
              <Link onClick={handleClose} href={`/${post?.userId}`}>
                <ProfilePicture
                  className="h-8 w-8"
                  imageUrl={post?.user.imageUrl}
                />
              </Link>
              <Link onClick={handleClose} href={`/${post?.userId}`}>
                <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
                  {post?.user.username}
                </span>
              </Link>
            </div>
            <div>
              <Button
                className="hover:text-muted-foreground p-0"
                variant="ghost"
              >
                <MoreHorizontal
                  onClick={onPostPropertiesModalOpen}
                  className="h-5 w-5"
                />
              </Button>
            </div>
          </div>
          <div className="flex-1 order-2 md:order-1 overflow-y-auto">
            <CommentSection
              formattedTime={formattedTime}
              comments={comments}
              post={post}
            />
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-4">
            <PostInput
              formattedTime={formattedTime}
              isLiked={isLiked}
              post={post}
              isFavorited={isFavorited}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
