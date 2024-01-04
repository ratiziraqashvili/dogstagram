"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { MoreHorizontal, Settings } from "lucide-react";

interface ProfileInfoProps {
  username: string | null;
  firstName: string | null;
}

export const ProfileInfo = ({ username, firstName }: ProfileInfoProps) => {
  const { user } = useClerk();

  return (
    <div className="space-y-4">
      <div className="flex gap-3 md:gap-24 justify-between items-center md:pt-2 flex-col md:flex-row">
        <div>
          <span className="text-xl pr-2">{username}</span>
        </div>
        <div className="flex gap-4 ">
          <Button className="h-[2rem]" variant={user?.username === username ? "default" : "amber"}>
            {user?.username === username ? (
              "View archive"
            ) : (
                "Follow"
            )}
          </Button>
          <button>
            {user?.username === username ? <Settings /> : <MoreHorizontal />}
          </button>
        </div>
      </div>
      <div className="md:flex hidden gap-9 pt-1">
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">0</span> posts
        </div>
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">0</span> followers
        </div>
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">0</span> following
        </div>
      </div>
      <div className="hidden md:block">
        <p className="lowercase font-bold">{firstName}</p>
      </div>
    </div>
  );
};
