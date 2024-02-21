import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCallback, useRef, useState } from "react";
import { EmojiPicker } from "./emoji-pickers";
import { SinglePost } from "@/types";
import axios from "axios";
import qs from "query-string";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Restrict } from "@prisma/client";
import { useAuth } from "@clerk/nextjs";

interface PostInputProps {
  post: SinglePost | null;
  isLiked: boolean | undefined;
  formattedTime: string;
  isFavorited: boolean | undefined;
  restrictedUsers: Restrict[] | undefined;
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

export const PostInput = ({
  post,
  isLiked: liked,
  formattedTime,
  isFavorited: favorited,
  restrictedUsers,
}: PostInputProps) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
  const [isFavorited, setIsFavorited] = useState<boolean | undefined>(
    favorited
  );
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(post?._count.likes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userId } = useAuth();

  console.log(restrictedUsers);

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
      } else return;
    } catch (error) {
      console.error("client error in onComment", error);
    } finally {
      setIsLoading(false);
      setComment("");
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && comment) {
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
      router.refresh();
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
      router.refresh();
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
      <div className="flex justify-between px-4 border-t-[1px] pt-3">
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
          <MessageCircle
            onClick={onInputFocus}
            className="cursor-pointer hover:opacity-50"
          />
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
      <div className={cn("px-4", post?.hideComments && "pb-3")}>
        <p className="text-sm">
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
        <span className="text-muted-foreground text-xs">{formattedTime}</span>
      </div>
      {!post?.hideComments && (
        <div className="flex items-center gap-2 border-t-[1px] px-4 py-2">
          <EmojiPicker
            className="h-6 w-6"
            onChange={(value) => setComment(comment + value)}
          />
          <Input
            onKeyDown={(e) => onEnter(e)}
            disabled={isLoading}
            ref={inputRef}
            value={comment}
            onChange={onInputChange}
            placeholder="Add a comment..."
            className="border-none"
          />
          <Button
            onClick={onComment}
            disabled={comment === "" || isLoading}
            className="p-0 text-amber-600"
            variant="ghost"
          >
            Post
          </Button>
        </div>
      )}
    </>
  );
};
