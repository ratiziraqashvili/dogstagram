"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchSheet } from "./search-sheet";

interface MobileNavbarProps {
  unReadNotiCount: number;
}

export const MobileNavbar = ({ unReadNotiCount }: MobileNavbarProps) => {
  const pathname = usePathname();
  const isProfilePage = pathname.split("/")[1].startsWith("user_");
  const isNotificationPage = pathname.startsWith("/notifications");
  const isPostPage = pathname.startsWith("/post");

  if (isProfilePage || isPostPage || isNotificationPage) {
    return null;
  }

  return (
    <nav className="border-b-[1px] h-[3.8rem] flex justify-between items-center w-full fixed">
      <div className="cursor-pointer">
        <Link href="/">
          <Image src="/logo.png" alt="Dogstagram" width={130} height={130} />
        </Link>
      </div>
      <div className="flex items-center gap-5 pr-5">
          <SearchSheet />
        <div className="relative">
          <Link href="/notifications">
            <Heart className="w-6 h-6 cursor-pointer hover:scale-105 transition" />
          </Link>
          {unReadNotiCount > 0 && (
            <span className="absolute -top-2 left-3 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unReadNotiCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
