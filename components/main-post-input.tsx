"use client";

import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useToast } from "./ui/use-toast";
import { SinglePost } from "@/types";

interface MainPostInputProps {
  post: SinglePost;
  liked: boolean;
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

export const MainPostInput = ({ liked, post }: MainPostInputProps) => {
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState<boolean | undefined>(liked);
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

  return (
    <>
      <div className="flex justify-between py-3">
        <div className="flex gap-2">
          <Heart className="cursor-pointer" />
          <MessageCircle className="cursor-pointer" />
        </div>
        <div>
          <Bookmark className="cursor-pointer" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold">
          {likeCount === 0 && !post?.hideLikes ? (
            <>
              <span>Be the first to </span>
              <span className="font-semibold hover:opacity-50 cursor-pointer">
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
