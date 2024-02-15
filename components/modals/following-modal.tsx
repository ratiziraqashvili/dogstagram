import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import { ProfilePicture } from "../profile-picture";
import { Bookmark, ChevronRight, Star, X } from "lucide-react";
import { useFollower } from "@/hooks/use-follower-store";

export const FollowingModal = () => {
  const { isOpen, onClose, type, onOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsFollowing, setFollowerCount, followerCount } = useFollower();

  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<Partial<User>>({});

  //just getting user info
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/user/${userId}`);
      setUser(res.data);
    };

    fetchUser();
  }, [userId]);

  const isModalOpen = isOpen && type === "following";

  const handleClose = () => {
    onClose();
  };

  //unfollowing user
  const onUnfollow = async () => {
    setIsLoading(true);
    try {
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
      handleClose();
      await axios.delete(`/api/users/unfollow/${userId}`);

      router.refresh();
    } catch (error) {
      console.error(error);
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const onRestrictModalOpen = () => {
    onOpen("restrict");
  };

  const buttons = [
    { label: "Restrict", onClick: onRestrictModalOpen, icon: ChevronRight },
    { label: "Unfollow", onClick: onUnfollow },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 w-[70%] sm:w-[25rem] gap-0">
        <DialogHeader>
          <DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none">
              <X className="w-4 h-4 " />
            </DialogClose>
            <div className="flex flex-col justify-center items-center gap-1 w-full border-b-[1px] pb-3">
              <div>
                <ProfilePicture
                  className="w-14 h-14"
                  imageUrl={user?.imageUrl}
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {buttons.map((button) => (
            <button
              key={button.label}
              onClick={button.onClick}
              className="hover:bg-primary/10 py-3 flex justify-between p-3 text-[0.890rem] transition disabled:pointer-events-none disabled:opacity-50"
              disabled={isLoading}
            >
              {button.label}
              {button.icon ? <button.icon className="w-5 h-5" /> : null}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
