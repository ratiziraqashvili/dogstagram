import { currentUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfilePictureProps {
  className?: string;
}

export const ProfilePicture = async ({ className = "w-6 h-6" }: ProfilePictureProps) => {
  const user = await currentUser();

  return (
    <Avatar className={className}>
      <AvatarImage src={user?.imageUrl} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
