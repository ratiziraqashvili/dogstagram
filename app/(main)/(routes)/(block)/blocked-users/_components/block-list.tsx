"use client";

import { ProfilePicture } from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BlockListProps {
  blockedUser: User[];
}

export const BlockList = ({ blockedUser }: BlockListProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onUnblock = async (blockedUserId: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/block/${blockedUserId}`);

      router.refresh();
      toast({
        title: "Unblocked",
        variant: "default",
      });
    } catch (error) {
      console.error("error in [BLOCK_LIST]", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (blockedUser.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[35rem] md:h-[40rem]">
        <p className="font-bold text-2xl text-center">
          You have not blocked any users yet!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-8 w-full">
      <div>
        <h1 className="font-semibold text-md">Your blocked users</h1>
      </div>
      <div className="flex flex-col gap-4">
        {blockedUser.map((user) => (
          <div
            className="flex justify-between items-center w-full"
            key={user.clerkId}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <ProfilePicture className="w-11 h-11" imageUrl={user.imageUrl} />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-sm text-muted-foreground">
                  {user.firstName}
                </p>
              </div>
            </div>
            <div>
              <Button
                disabled={isLoading}
                onClick={() => onUnblock(user.clerkId)}
                className="h-8"
                variant="default"
              >
                Unblock
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
