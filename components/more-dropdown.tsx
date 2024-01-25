"use client"

import { AlertCircle, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const MoreDropDown = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-4 p-3  w-full cursor-pointer">
          <Menu className="w-7 h-7" />
          <span className="hidden xl:block text-md">
            More
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56 p-2 ml-2">
        <DropdownMenuItem onClick={() => router.push("/blocked-users")} className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <button className="p-2 pl-0 ">Blocked users</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()} className="h-12">
          <button className="text-md">Log out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
