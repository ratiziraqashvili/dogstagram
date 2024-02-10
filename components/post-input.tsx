import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { EmojiPicker } from "./emoji-pickers";
import { SinglePost } from "@/types";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PostInputProps {
  post: SinglePost;
  isLiked: boolean | undefined;
}

export const PostInput = ({ post, isLiked: liked }: PostInputProps) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  const onLike = async () => {
    try {
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      await axios.post(`/api/like/${post?.id}`);

      router.refresh();
    } catch (error) {
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
      console.log("client error in like, post-input", error);
    }
  };

  const onUnLike = async () => {
    try {
      setIsLiked(false);
      setLikeCount((prevCount) => prevCount - 1);
      await axios.delete(`/api/like/${post?.id}`);

      router.refresh();
    } catch (error) {
      setIsLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
      console.log("client error in unlike, post-input", error);
    }
  };

  const onComment = async () => {
    setIsLoading(true);
    try {
      if (!!comment) {
        await axios.post(`/api/comment/${post?.id}`);
      } else return;

      router.refresh();
    } catch (error) {
      console.log("client error in onComment", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between px-4 border-t-[1px] pt-3">
        <div className="flex gap-2">
          <Heart
            onClick={isLiked ? onUnLike : onLike}
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
      <div className="px-4">
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
        <span className="text-muted-foreground text-xs">1 day ago</span>
      </div>
      <div className="flex items-center gap-2 border-t-[1px] px-4 py-2">
        <EmojiPicker
          className="h-6 w-6"
          onChange={(value) => setComment(comment + value)}
        />
        <Input
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
    </>
  );
};
