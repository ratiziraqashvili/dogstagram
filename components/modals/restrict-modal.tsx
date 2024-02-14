import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import { MessageCircle, ShieldAlert } from "lucide-react";

export const RestrictModal = () => {
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<Partial<User>>({});

  const isModalOpen = isOpen && type === "restrict";

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/user/${userId}`);
      setUser(res.data);
    };

    fetchUser();
  }, [userId]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="pb-0 w-[70%] sm:w-[25rem] gap-0 px-0">
        <div className="flex flex-col gap-4 pb-4 border-b-[1px] px-5">
          <div>
            <h1 className="text-xl text-center">
              Are you having problem with {user.username}?
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <ShieldAlert className="w-11 h-11" />
              <span className="text-sm text-muted-foreground">
                Limit unwanted interactions without having to block or unfollow
                someone you know.
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <MessageCircle className="w-8 h-8" />
              <span className="text-sm text-muted-foreground">
                You'll control if others can see their new comments on your
                posts.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <button className="text-amber-500 text-sm hover:text-amber-600 font-semibold border-b-[1px] py-5">
            Restrict Account
          </button>
          <DialogClose className="text-slate-600 text-sm hover:text-slate-700 font-semibold py-5">
            Cancel
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
