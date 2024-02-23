"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

interface ProfileNavbar {
  username: string | undefined;
  profileId: string | undefined;
}

export const ProfileNavbar = ({ username, profileId }: ProfileNavbar) => {
  const { userId } = useAuth();
  const { onOpen } = useModal();

  const SettingsModalOpen = () => {
    onOpen("settings")
  }

  return (
    <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem] w-full fixed">
      <div className="">
        <Button onClick={profileId === userId ? SettingsModalOpen : undefined} variant="ghost" className="hover:text-amber-0">
          {profileId === userId ? (
            <Settings />
          ) : (
            <Link href="/">
              <ChevronLeft />
            </Link>
          )}
        </Button>
      </div>
      <div className="">
        <p className="font-semibold">{username}</p>
      </div>
      {/* added empty div to push username in center */}
      <div className="w-[2.9rem]" />
    </div>
  );
};
