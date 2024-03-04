import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useOrigin } from "@/hooks/use-origin";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { SinglePost } from "@/types";
import qs from "query-string";
import axios from "axios";

export const PostPropertiesModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useSecondModal();
  const { onOpen: editPostOpen, onClose: closeModal } = useModal();
  const { onClose: onCloseRootModal } = useModal();
  const { toast } = useToast();
  const post: SinglePost = data;
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const origin = useOrigin();
  const router = useRouter();

  const isModalOpen = isOpen && type === "postProperties";

  const handleClose = () => {
    onClose();
  };

  const postUrl = `${origin}/post/${post?.id}`;

  const onAboutAccountModalOpen = () => {
    onOpen("aboutPost", post);
  };

  const isAuthor = post?.userId === userId;

  const onCopy = () => {
    navigator.clipboard.writeText(postUrl);
    toast({
      title: "Link copied to clipboard.",
      variant: "default",
      duration: 3000,
    });

    handleClose();
  };

  const onDelete = async (authorId: string) => {
    setIsLoading(true);
    try {
      if (isAuthor) {
        const url = qs.stringifyUrl({
          url: `/api/posts/delete/${post.id}`,
          query: {
            authorId,
          },
        });

        await axios.delete(url);

        toast({
          title: "Post deleted successfully.",
          variant: "default",
          duration: 3000,
        });
      }

      handleClose();
      onCloseRootModal();
      router.push(`/${userId}`);
      router.refresh();
    } catch (error) {
      console.error("[POST_PROPERTIES_MODAL] error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCommentUnhide = async (authorId: string) => {
    setIsLoading(true);
    try {
      if (isAuthor) {
        const url = qs.stringifyUrl({
          url: `/api/posts/update/comments/unhide/${post.id}`,
          query: {
            authorId,
          },
        });

        await axios.patch(url);

        toast({
          title: "Comments unhid successfully",
          variant: "default",
          duration: 3000,
        });

        post.hideComments = false;

        handleClose();
        router.refresh();
      }
    } catch (error) {
      console.error("[POST_PROPERTIES_MODAL] error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCommentHide = async (authorId: string) => {
    setIsLoading(true);
    try {
      if (isAuthor) {
        const url = qs.stringifyUrl({
          url: `/api/posts/update/comments/hide/${post.id}`,
          query: {
            authorId,
          },
        });

        await axios.patch(url);

        toast({
          title: "Comments hid successfully",
          variant: "default",
          duration: 3000,
        });

        post.hideComments = true;

        handleClose();
        router.refresh();
      }
    } catch (error) {
      console.error("[POST_PROPERTIES_MODAL] error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLikeHide = async (authorId: string) => {
    setIsLoading(true);
    try {
      if (isAuthor) {
        const url = qs.stringifyUrl({
          url: `/api/posts/update/likes/hide/${post.id}`,
          query: {
            authorId,
          },
        });

        await axios.patch(url);

        toast({
          title: "Likes hid successfully",
          variant: "default",
          duration: 3000,
        });

        post.hideLikes = true;

        handleClose();
        router.refresh();
      }
    } catch (error) {
      console.error("[POST_PROPERTIES_MODAL] error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLikeUnhide = async (authorId: string) => {
    setIsLoading(true);
    try {
      if (isAuthor) {
        const url = qs.stringifyUrl({
          url: `/api/posts/update/likes/unhide/${post.id}`,
          query: {
            authorId,
          },
        });

        await axios.patch(url);

        toast({
          title: "Likes unhid successfully",
          variant: "default",
          duration: 3000,
        });

        post.hideLikes = false;

        handleClose();
        router.refresh();
      }
    } catch (error) {
      console.error("[POST_PROPERTIES_MODAL] error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreatePostModalOpen = () => {
    handleClose();
    editPostOpen("createPost", post);
  };

  const onReportModalOpen = (postId: string) => {
    onOpen("report", postId);
  };

  const redirectToPost = () => {
    handleClose();
    closeModal();
    router.push(postUrl);
  };

  const buttons = [
    isAuthor
      ? { label: "Delete", onClick: () => onDelete(post?.userId) }
      : null,
    isAuthor
      ? null
      : { label: "Report", onClick: () => onReportModalOpen(post?.id) },
    isAuthor ? { label: "Edit", onClick: onCreatePostModalOpen } : null,
    isAuthor
      ? {
          label: post?.hideLikes
            ? "Unhide like count to others"
            : "Hide like count to others",
          onClick: post?.hideLikes
            ? () => onLikeUnhide(post?.userId)
            : () => onLikeHide(post?.userId),
        }
      : null,
    isAuthor
      ? {
          label: post?.hideComments
            ? "Turn on commenting"
            : "Turn off commenting",
          onClick: post?.hideComments
            ? () => onCommentUnhide(post?.userId)
            : () => onCommentHide(post?.userId),
        }
      : null,
    { label: "Go to post", onClick: redirectToPost },
    { label: "Copy link", onClick: onCopy },
    { label: "About this post", onClick: onAboutAccountModalOpen },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 pt-0 w-[70%] sm:w-[25rem] gap-0">
        <div className="flex flex-col h-full items-center">
          {buttons.filter(Boolean).map((button, i) => (
            <button
              disabled={isLoading}
              key={i}
              onClick={button!.onClick}
              className="hover:bg-primary/10 w-full py-3.5 flex justify-center p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50 text-center border-b-[1px]"
            >
              <span
                className={cn(
                  (button!.label === "Delete" &&
                    "font-bold text-red-600 opacity-85") ||
                    (button!.label === "Report" &&
                      "font-bold text-red-600 opacity-85")
                )}
              >
                {button!.label}
              </span>
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
