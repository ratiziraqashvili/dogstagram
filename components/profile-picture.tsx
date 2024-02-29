"use client";

import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { Story } from "@prisma/client";

interface ProfilePictureProps {
  className?: string;
  imageUrl?: string | undefined | null;
  onClick?: boolean;
  hasStory?: boolean;
  story?: Story[];
}

export const ProfilePicture = ({
  className = "w-6 h-6",
  imageUrl,
  onClick = false,
  hasStory = false,
  story,
}: ProfilePictureProps) => {
  const { user } = useClerk();
  const { onOpen } = useModal();

  const onAboutAccountModalOpen = () => {
    onClick && hasStory ? onOpen("story", story) : onOpen("aboutAccount");
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
