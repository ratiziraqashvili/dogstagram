"use client";

import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { StoryType } from "@/types";

interface ProfilePictureProps {
  className?: string;
  imageUrl?: string | undefined | null;
  onClick?: "story" | "aboutAccount";
  story?: StoryType;
}

export const ProfilePicture = ({
  className = "w-6 h-6",
  imageUrl,
  onClick,
  story,
}: ProfilePictureProps) => {
  const { user } = useClerk();
  const { onOpen } = useModal();

  const onAboutAccountModalOpen = () => {
    if (onClick === "aboutAccount") {
      onOpen("aboutAccount");
      return;
    }
    if (onClick === "story") {
      onOpen("story", story);
      return;
    }
    return;
  };

  return (
    <Avatar
      onClick={onAboutAccountModalOpen}
      className={cn(className, onClick && "cursor-pointer")}
    >
      <AvatarImage src={imageUrl || user?.imageUrl} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
