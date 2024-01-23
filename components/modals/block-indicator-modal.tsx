import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface LimitedUser {
  clerkId: string;
  username: string;
}

export const BlockIndicator = () => {
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const [user, setUser] = useState<LimitedUser>({} as LimitedUser);
  const { userId } = params;
  const [isLoading, setIsLoading] = useState(true);

  const isModalOpen = isOpen && type === "blockIndicator";

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`);
        setUser({
          clerkId: res.data.clerkId,
          username: res.data.username,
        });
      } catch (error) {
        console.error("Error fetching user in about account modal", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] pt-3 pb-0 px-0">
        user blocked
      </DialogContent>
    </Dialog>
  );
};
