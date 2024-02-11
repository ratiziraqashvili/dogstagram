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

interface PostInputProps {
  post: SinglePost;
  isLiked: boolean | undefined;
  formattedTime: string;
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
}: PostInputProps) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  const onLike = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      await axios.post(`/api/like/${post?.id}`);

      router.refresh();
    } catch (error: any) {
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
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
      setLikeCount((prevCount) => prevCount - 1);
      await axios.delete(`/api/like/${post?.id}`);

      router.refresh();
    } catch (error) {
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      console.error("client error in unlike, post-input", error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deboundedOnLike = useCallback(debounce(onLike, 300), []);
  const deboundedOnUnLike = useCallback(debounce(onUnLike, 300), []);

  const onComment = async () => {
    setIsLoading(true);
    try {
      if (!!comment) {
        const url = qs.stringifyUrl({
          url: `/api/comment/${post?.id}`,
          query: {
            content: comment,
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
              isLiked ? "text-red-600 fill-red-600 filter" : "text-black"
            )}
          />
          <MessageCircle
            onClick={onInputFocus}
            className="cursor-pointer hover:opacity-50"
          />
          <Send className="cursor-pointer hover:opacity-50" />
        </div>
        <div>
          <Bookmark className="cursor-pointer hover:opacity-50" />
        </div>
      </div>
      <div className={cn("px-4", post.hideComments && "pb-3")}>
        <p className="text-sm">
          {likeCount === 0 ? (
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
            <span>{likeCount} likes</span>
          )}
        </p>
        <span className="text-muted-foreground text-xs">{formattedTime}</span>
      </div>
      {!post.hideComments && (
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
