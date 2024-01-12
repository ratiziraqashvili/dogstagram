"use client"

import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfilePictureProps {
  className?: string;
  imageUrl?: string | undefined | null; 
}

export const ProfilePicture = ({ className = "w-6 h-6", imageUrl }: ProfilePictureProps) => {
  const { user } = useClerk();

  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl || user?.imageUrl} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
