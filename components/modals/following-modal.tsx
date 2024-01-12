"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

export const FollowingModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const userId = params.userId;

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //getting user info from api to display accordingly
        await axios.get(`/api/user/${userId}`)
      } catch (error) {
        console.log("Error while fetching user", error)
      }
    }
  }, []);

  if (!isMounted) {
    return null;
  }

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
                {user?.imageUrl && (
                  <Image
                    src={user?.imageUrl}
                    alt="Profile Picture"
                    width={200}
                    height={200}
                  />
                )}
              </div>
              <div>
                <p>{user?.username}</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
