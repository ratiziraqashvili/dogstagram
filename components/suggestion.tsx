"use client";

import { SuggestedUsers } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import qs from "query-string";

interface SuggestionProps {
  suggestedUsers: SuggestedUsers;
}

export const Suggestion = ({ suggestedUsers }: SuggestionProps) => {
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

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="w-full pl-[13%]">
      <h1 className="text-muted-foreground text-sm font-semibold opacity-90 pb-4">
        Suggested for you
      </h1>
      <div className="flex">
        <div className="flex flex-col gap-3 w-full pr-[15%]">
          {users.map((user) => (
            <div className="flex justify-between">
              <Link
                href={`/${user.clerkId}`}
                className="flex gap-2 items-center"
              >
                <ProfilePicture
                  className="w-10 h-10"
                  imageUrl={user.imageUrl}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    Suggested for you
                  </span>
                </div>
              </Link>
              <Button
                onClick={
                  user.isFollowing
                    ? () => onUnfollow(user.clerkId)
                    : () => onFollow(user.clerkId)
                }
                className={cn(
                  "text-xs transition-none",
                  user.isFollowing
                    ? "text-black hover:opacity-80 hover:text-black"
                    : "text-amber-500"
                )}
                variant="ghost"
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
