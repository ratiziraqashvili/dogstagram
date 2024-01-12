"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@prisma/client";
import { ProfilePicture } from "../profile-picture";

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

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col justify-center items-center">
              <div>
                <ProfilePicture className="w-28 h-28" imageUrl={user?.imageUrl} />
              </div>
              <div>{user?.username && <p>{user?.username}</p>}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
