"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent } from "../ui/dialog";
import { useEffect, useState } from "react";

export const FollowingModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, onClose, type } = useModal();

  useEffect(() => {
    setIsMounted(true);
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
      <DialogContent>this is modal</DialogContent>
    </Dialog>
  );
};
