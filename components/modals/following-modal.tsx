"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import { ProfilePicture } from "../profile-picture";
import { Separator } from "../ui/separator";
import { Bookmark, ChevronRight, Star } from "lucide-react";

export const FollowingModal = () => {
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/user/${userId}`);
      setUser(res.data);
    };

    fetchUser();
  }, []);

  const isModalOpen = isOpen && type === "following";

  const handleClose = () => {
    onClose();
  };

  const buttons = [
    { label: "Add to favorites", onClick: () => {}, icon: Star },
    { label: "Mute", onClick: () => {}, icon: Bookmark },
    { label: "Restrict", onClick: () => {}, icon: ChevronRight },
    { label: "Unfollow", onClick: () => {} },
    // ... other buttons
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="px-0 pb-0 w-[25rem] gap-0">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col justify-center items-center gap-1 w-full border-b-[1px] pb-5">
              <div>
                <ProfilePicture className="w-14 h-14" imageUrl={user?.imageUrl} />
              </div>
              <div>
                <p className="text-sm font-bold">{user?.username}</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
        {buttons.map((button) => (
          <button
            key={button.label}
            onClick={button.onClick}
            className="hover:bg-primary/10 py-3 flex justify-between p-3 text-[0.975rem]"
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
