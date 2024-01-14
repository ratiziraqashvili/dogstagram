"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileNavbar {
  username: string | undefined;
  profileId: string | undefined;
}

export const ProfileNavbar = ({ username, profileId }: ProfileNavbar) => {
  const { userId } = useAuth();


  return (
    <div className="flex items-center md:hidden border-b-[1px] h-[2.8rem]">
      <div className="flex-1">
        <Button variant="ghost" className="hover:text-amber-0">
          {profileId === userId ? (
            <Settings />
          ) : (
            <Link href="/">
              <ChevronLeft />
            </Link>
          )}
        </Button>
      </div>
      <div className=" mr-[45%]">
        <p className="font-semibold">{username}</p>
      </div>
    </div>
  );
};
