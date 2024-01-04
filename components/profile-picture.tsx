"use client"

import { useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@clerk/nextjs/server";

interface ProfilePictureProps {
  className?: string;
  imageUrl?: string; 
}

export const ProfilePicture = async ({ className = "w-6 h-6", imageUrl }: ProfilePictureProps) => {
  const { user } = useClerk();

  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl || user?.imageUrl} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
