"use client";

import { ProfilePicture } from "./profile-picture";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { SuggestedUsers } from "@/types";
import qs from "query-string";
import axios from "axios";
import Link from "next/link";

interface SuggestedAccountsProps {
  suggestedUsers: SuggestedUsers;
}

export const SuggestedAccounts = ({
  suggestedUsers,
}: SuggestedAccountsProps) => {
  const [users, setUsers] = useState(suggestedUsers);
  const router = useRouter();
  const { toast } = useToast();

  const onFollow = async (userId: string) => {
    // Making req to api route to follow user
    try {
      setUsers((prev) =>
        prev.map((f) =>
          f.clerkId === userId ? { ...f, isFollowing: true } : f
        )
      );

      const url = qs.stringifyUrl({
        url: "/api/users/follow",
        query: {
          otherUserId: userId,
        },
      });

      await axios.post(url);

      router.refresh();
    } catch (error: any) {
      console.error(error);
      setUsers((prev) =>
        prev.map((f) =>
          f.clerkId === userId ? { ...f, isFollowing: true } : f
        )
      );

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    }
  };

  const onUnfollow = async (userId: string) => {
    try {
      setUsers((prev) =>
        prev.map((f) =>
          f.clerkId === userId ? { ...f, isFollowing: false } : f
        )
      );
      await axios.delete(`/api/users/unfollow/${userId}`);

      router.refresh();
    } catch (error: any) {
      console.error(error);
      setUsers((prev) =>
        prev.map((f) =>
          f.clerkId === userId ? { ...f, isFollowing: true } : f
        )
      );

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 pt-8 w-full">
      <div>
        <h1 className="font-semibold text-md">Suggested</h1>
      </div>
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <div
            className="flex justify-between items-center w-full"
            key={user.clerkId}
          >
            <Link
              href={`/${user.clerkId}`}
              className="flex items-center gap-3 cursor-pointer"
            >
              <ProfilePicture className="w-11 h-11" imageUrl={user.imageUrl} />
              <div>
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-sm text-muted-foreground">
                  {user.firstName}
                </p>
              </div>
            </Link>
            <div>
              <Button
                onClick={
                  user.isFollowing
                    ? () => onUnfollow(user.clerkId)
                    : () => onFollow(user.clerkId)
                }
                className="h-8"
                variant={user.isFollowing ? "default" : "amber"}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
