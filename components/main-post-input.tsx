"use client";

import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import { CommentArray, SinglePost } from "@/types";
import axios from "axios";
import qs from "query-string";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { useMediaQuery } from "react-responsive";
import { Like, Post, Restrict } from "@prisma/client";
import { EmojiPicker } from "./emoji-pickers";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface MainPostInputProps {
  likes: Like[];
  post: SinglePost;
  liked: boolean;
  isRestricted: boolean;
  savedPostsId: {
    postId: string;
  }[];
  restrictedUserId: string[];
  comments: CommentArray;
  restrictedUsers: Restrict[];
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
  isRestricted,
  savedPostsId: id,
  restrictedUserId,
  comments,
  restrictedUsers,
  likes,
}: MainPostInputProps) => {
  const savedPostsId = id?.map((savePostId) => savePostId.postId);
  const favorited = savedPostsId?.includes(post.id);

  const [isFavorited, setIsFavorited] = useState<boolean | undefined>(
    favorited
  );
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [commentCount, setCommentCount] = useState(post._count.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { onOpen } = useModal();

  const isSmallScreen = useMediaQuery({ maxWidth: 420 });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  const onLike = useCallback(async () => {
    try {
      if (isRestricted) {
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
          restrictedUserId: isRestricted && restrictedUserId,
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
      if (isRestricted) {
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

        setCommentCount((prev) => prev + 1);

        const url = qs.stringifyUrl({
          url: `/api/comment/${post?.id}`,
          query: {
            content: comment,
            recipient: post?.userId,
            restrictedUserId: isRestricted && restrictedUserId,
          },
        });

        await axios.post(url);
      } else return;
    } catch (error: any) {
      setCommentCount((prev) => prev - 1);
      console.error("client error in onComment", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
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

  const onPostInfoModalOpen = (
    post: Post,
    likes: Like[],
    comments: CommentArray,
    savedPostsId: {
      postId: string;
    }[],
    restrictedUsers: Restrict[]
  ) => {
    if (isSmallScreen) {
      router.push(`/post/${post.id}`);
    } else {
      onOpen("postInfo", post, likes, comments, savedPostsId, restrictedUsers);
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
      <div className="pt-2">
        {post.caption && (
          <p className="text-sm space-x-1">
            <span className="font-semibold">{post.user.username}</span>
            <span>{post.caption}</span>
          </p>
        )}
      </div>
      <div>
        <span
          onClick={() =>
            onPostInfoModalOpen(post, likes, comments, id, restrictedUsers)
          }
          className="text-sm text-muted-foreground cursor-pointer"
        >
          View all {commentCount} comments
        </span>
      </div>
      {!post?.hideComments && (
        <div className="flex items-center gap-2 px-2 py-2">
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
