import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

interface LimitedUser {
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
      <DialogContent className="w-[70%] sm:w-[25rem] px-0 pb-0 pt-6 gap-0">
        <div className="flex justify-center items-center flex-col gap-1 border-b-[1px] pb-8">
          <h1 className="text-xl flex items-center gap-1">
            <span>Blocked </span>
            <span>
              {" "}
              {isLoading ? (
                <Skeleton className="w-20 h-4" />
              ) : (
                user.username + "."
              )}{" "}
            </span>
          </h1>
          <span className="text-sm text-muted-foreground">
            You can unblock them anytime from their profile.
          </span>
        </div>
        <DialogClose className="p-3 text-sm">Dismiss</DialogClose>
      </DialogContent>
    </Dialog>
  );
};
