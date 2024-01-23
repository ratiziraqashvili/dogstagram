import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface LimitedUser {
  clerkId: string;
  username: string;
}

export const BlockConfirmModal = () => {
  const [user, setUser] = useState<LimitedUser>({} as LimitedUser);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose, type, onOpen } = useModal();
  const { toast } = useToast();

  const params = useParams();
  const router = useRouter();

  const { userId } = params;

  const isModalOpen = isOpen && type === "blockConfirm";

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

  const onBlockIndicatorModalOpen = () => {
    onOpen("blockIndicator")
  }

  const onBlock = async () => {
    try {
      const response = await axios.post(`/api/block/${userId}`)

      onBlockIndicatorModalOpen();
      toast({
        title: "Blocked",
        variant: "default"
      })
      router.refresh();
    } catch (error) {
      console.error("Error blocking user in block-confirm-modal:", error)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] pt-3 pb-0 px-0">
        <div className="flex flex-col justify-center items-center text-center pt-3 gap-1 pb-6">
          <h1 className="text-xl flex gap-2 items-center">
            <span>Block</span>
            {isLoading ? (
              <Skeleton className="w-24 h-4" />
            ) : (
              user?.username + "?"
            )}
          </h1>
          <span className="text-muted-foreground text-sm w-[85%]">
            They won&apos;t be able to find your profile, posts or story on
            Dogstagram. Dogstagram won&apos;t let them know you blocked them.
          </span>
        </div>
        <div>
          <Button
            onClick={onBlock}
            className="hover:text-red-600 border-t-[1px] w-full h-[3rem] font-bold text-red-600 opacity-85"
            variant="ghost"
          >
            Block
          </Button>
          <DialogClose className="w-full">
            <div
              className="h-[3rem] w-full flex justify-center items-center border-t-[1px]"
            >
              <span className="text-sm">Cancel</span>
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
