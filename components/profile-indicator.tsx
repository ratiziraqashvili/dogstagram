"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export const ProfileIndicator = () => {
  const { user } = useUser();
  const { signOut } = useClerk()

  return (
    <div className="w-[31%] hidden xl:block">
      <div>
        <div className="flex justify-around mt-9">
          <Link href="/profile">
            <div className="flex gap-2 items-center">
              <div>
                <Image
                  src={user?.imageUrl!}
                  width={45}
                  height={45}
                  alt="Profile Picture"
                  className="rounded-full"
                />
              </div>
              <div className="">
                <span className="lowercase font-[600] text-sm">
                  {user?.firstName}
                </span>
              </div>
            </div>
          </Link>
          <div>
            <Button onClick={() => signOut()} className="text-xs text-sky-500 font-bold" variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
