"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ProfilePicture = () => {
  const { user } = useUser();

  return (
    <Avatar className="w-6 h-6">
      <AvatarImage className="" src={user?.imageUrl} />
      <AvatarFallback>Profile Picture</AvatarFallback>
    </Avatar>
  );
};
