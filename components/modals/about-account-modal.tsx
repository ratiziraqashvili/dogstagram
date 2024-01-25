import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProfilePicture } from "../profile-picture";
import { CalendarDays, MapPin } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { countryCodes } from "@/constants/country-codes";

export const AboutAccountModal = () => {
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const [user, setUser] = useState<Partial<User>>({});
  const { userId } = params;
  const [isLoading, setIsLoading] = useState(true);

  const isModalOpen = isOpen && type === "aboutAccount";

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/${userId}`);
        setUser(res.data);
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

  const userCountry = countryCodes[user?.location!];

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] py-3 px-0">
        <div className="flex flex-col">
          <div className="flex justify-center border-b-[1px] pb-[0.580rem]">
            <h1 className="font-semibold">About this account</h1>
          </div>
          <div className="pt-3 pb-8">
            <div className="flex flex-col justify-center items-center">
              {isLoading ? (
                <>
                  <Skeleton className="w-[5rem] h-[5rem] rounded-full" />
                  <Skeleton className="w-[6rem] h-3 mt-4" />
                </>
              ) : (
                <>
                  <ProfilePicture
                    className="w-[5rem] h-[5rem]"
                    imageUrl={user?.imageUrl}
                  />
                  <span className="font-semibold pt-2.5">{user?.username}</span>
                </>
              )}
              <p className="text-xs text-muted-foreground w-[80%] text-center pt-2">
                To help keep our community authentic, we&apos;re showing
                information about accounts on Dogstagram.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-7 px-4 pb-4 border-b-[1px]">
            <div className="flex items-center gap-3.5">
              <CalendarDays className="w-7 h-7" />
              <div className="flex flex-col">
                <span>Date joined</span>
                <span className="text-muted-foreground text-sm">
                  {isLoading ? (
                    <Skeleton className="h-3 w-5" />
                  ) : user?.createdAt ? (
                    new Date(user.createdAt).getFullYear()
                  ) : null}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <MapPin className="w-7 h-7" />
              <div className="flex flex-col">
                <span>Account based in</span>
                <span className="text-muted-foreground text-sm">
                  {userCountry || "Unspecified"} 
                </span>
              </div>
            </div>
          </div>
          <DialogClose>
            <div className="flex justify-center items-center">
              <div
                className="hover:text-black font-normal pt-3"
              >
                <span className="text-sm">Close</span>
              </div>
            </div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
