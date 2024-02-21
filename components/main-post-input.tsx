"use client";

import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import { SinglePost } from "@/types";
import axios from "axios";
import qs from "query-string";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Restrict } from "@prisma/client";
import { useSecondModal } from "@/hooks/use-second-modal-store";

interface MainPostInputProps {
  post: SinglePost;
  liked: boolean;
  restrictedUsers: Restrict[] | undefined;
  savedPostsId: {
    postId: string;
  }[];
}

const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const MainPostInput = ({
  liked,
  post,
  restrictedUsers,
  savedPostsId: id,
}: MainPostInputProps) => {
  const savedPostsId = id?.map((savePostId) => savePostId.postId);
  const favorited = savedPostsId?.includes(post.id);

  const [isFavorited, setIsFavorited] = useState<boolean | undefined>(
    favorited
  );
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userId } = useAuth();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  const restrictedUserId = restrictedUsers?.map(
    (user) => user.restrictedUserId
  );

  const onLike = useCallback(async () => {
    try {
      if (restrictedUserId?.includes(userId!)) {
        toast({
          title: "You are restricted by user, therefore you can not like post.",
          variant: "default",
          duration: 3000,
        });
        return;
      }
      setIsSubmitting(true);
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount! + 1);

      const url = qs.stringifyUrl({
        url: `/api/like/${post?.id}`,
        query: {
          recipient: post?.userId,
          restrictedUserId: restrictedUserId,
        },
      });

      await axios.post(url);

      router.refresh();
    } catch (error: any) {
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount! - 1);
      console.error("client error in like, post-input", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const onUnLike = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount! - 1);
      await axios.delete(`/api/like/${post?.id}`);

      router.refresh();
    } catch (error: any) {
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount! + 1);
      console.error("client error in unlike, post-input", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deboundedOnLike = useCallback(debounce(onLike, 300), []);
  const deboundedOnUnLike = useCallback(debounce(onUnLike, 300), []);

  const MAX_COMMENT_LENGTH = 150;

  const onComment = async () => {
    setIsLoading(true);
    try {
      if (restrictedUserId?.includes(userId!)) {
        toast({
          title:
            "You are restricted by user, therefore you can not comment on post.",
          variant: "default",
          duration: 3000,
        });
        return;
      }

      if (!!comment) {
        if (comment.length > MAX_COMMENT_LENGTH) {
          toast({
            title: "Comment is too long! Limit is 150 letters.",
            variant: "default",
            duration: 3000,
          });
          return;
        }

        const url = qs.stringifyUrl({
          url: `/api/comment/${post?.id}`,
          query: {
            content: comment,
            recipient: post?.userId,
            restrictedUserId: restrictedUserId,
          },
        });

        await axios.post(url);
        router.refresh();
      } else return;
    } catch (error) {
      console.error("client error in onComment", error);
    } finally {
      setIsLoading(false);
      setComment("");
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onComment();
    }
  };

  const onFavorite = async () => {
    try {
      setIsSubmitting(true);
      setIsFavorited(true);
      await axios.post("/api/posts/favorite", post);
      toast({
        title: "Post favorited.",
        variant: "default",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("error in client [COMPONENTS_POST-INPUT]", error);
      setIsFavorited(false);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUnFavorite = async () => {
    try {
      setIsSubmitting(true);
      setIsFavorited(false);

      const url = qs.stringifyUrl({
        url: "/api/posts/favorite",
        query: {
          postId: post?.id,
          authorId: post?.userId,
        },
      });

      await axios.delete(url);
      toast({
        title: "Post unfavorited.",
        variant: "default",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("error in client [COMPONENTS_POST-INPUT]", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between py-3">
        <div className="flex gap-2">
          <Heart
            onClick={
              !isSubmitting && isLiked ? deboundedOnUnLike : deboundedOnLike
            }
            className={cn(
              "cursor-pointer hover:opacity-50",
              isLiked ? "text-red-500 fill-red-500 filter" : "text-black"
            )}
          />
          <MessageCircle onClick={onInputFocus} className="cursor-pointer" />
        </div>
        <div>
          <Bookmark
            onClick={!isSubmitting && isFavorited ? onUnFavorite : onFavorite}
            className={cn(
              "cursor-pointer hover:opacity-50",
              isFavorited && "fill-black"
            )}
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">
          {likeCount === 0 && !post?.hideLikes ? (
            <>
              <span>Be the first to </span>
              <span
                onClick={onLike}
                className="font-semibold hover:opacity-50 cursor-pointer"
              >
                like this
              </span>
            </>
          ) : (
            !post?.hideLikes && <span>{likeCount} likes</span>
          )}
        </p>
      </div>
    </>
  );
};
