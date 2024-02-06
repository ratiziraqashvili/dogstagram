import { Bookmark, Heart, MessageCircle, Send, Smile } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { EmojiPicker } from "./emoji-pickers";

export const PostInput = () => {
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="flex justify-between px-4 border-t-[1px] pt-3">
        <div className="flex gap-2">
          <Heart className="cursor-pointer hover:opacity-50" />
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
          Be the first to{" "}
          <span className="font-semibold hover:opacity-50 cursor-pointer">
            like this
          </span>
        </p>
        <span className="text-muted-foreground text-xs">1 day ago</span>
      </div>
      <div className="flex items-center gap-2 border-t-[1px] px-4 py-2">
        <EmojiPicker
          className="h-6 w-6"
          onChange={(value) => setComment(comment + value)}
        />
        <Input
          ref={inputRef}
          value={comment}
          onChange={onInputChange}
          placeholder="Add a comment..."
          className="border-none"
        />
        <Button className="p-0 text-amber-600" variant="ghost">
          Post
        </Button>
      </div>
    </>
  );
};
