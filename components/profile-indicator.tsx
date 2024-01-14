"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { ProfilePicture } from "./profile-picture";

export const ProfileIndicator = () => {
  const { signOut, user } = useClerk();

  return (
    <div className="w-[31%] hidden xl:block">
      <div>
        <div className="flex justify-around mt-9">
          <Link href={`/${user?.id}`}>
            <div className="flex gap-2 items-center">
              <div>
                <ProfilePicture className="w-10 h-10" />
              </div>
              <div className="">
                <span className="lowercase font-[600] text-sm">
                  {user?.username}
                </span>
              </div>
            </div>
          </Link>
          <div>
            <Button
              onClick={() => signOut()}
              className="text-xs text-amber-500 font-semibold"
              variant="ghost"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
