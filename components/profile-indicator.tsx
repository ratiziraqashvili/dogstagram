"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { ProfilePicture } from "./profile-picture";
import { SuggestedUsers } from "@/types";
import { Suggestion } from "./suggestion";

interface ProfileIndicatorProps {
  suggestedUsers: SuggestedUsers;
}

export const ProfileIndicator = ({ suggestedUsers }: ProfileIndicatorProps) => {
  const { signOut, user } = useClerk();

  return (
    <div className="w-[31%] hidden xl:flex flex-col gap-4">
      <div className="w-full">
        <div className="flex justify-around mt-9">
          <Link href={`/${user?.id}`}>
            <div className="flex gap-2 items-center">
              <div>
                <ProfilePicture className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <span className="lowercase font-[600] text-sm active:text-muted-foreground">
                  {user?.username}
                </span>
                <span className="lowercase text-muted-foreground text-sm">
                  {user?.firstName}
                </span>
              </div>
            </div>
          </Link>
          <div>
            <Button
              onClick={() => signOut()}
              className="text-xs text-amber-500 font-semibold transition-none"
              variant="ghost"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      <Suggestion suggestedUsers={suggestedUsers} />
    </div>
  );
};
