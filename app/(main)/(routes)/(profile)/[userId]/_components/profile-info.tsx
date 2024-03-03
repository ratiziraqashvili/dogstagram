"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { ChevronDown, MoreHorizontal, Settings } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import Link from "next/link";
import { useFollower } from "@/hooks/use-follower-store";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";

interface ProfileInfoProps {
  username: string | undefined;
  firstName: string | null | undefined;
  userId: string;
  postCount: number;
  followerCountNumber: number;
  followingCountNumber: number;
  isFollowing: boolean;
}

export const ProfileInfo = ({
  username,
  firstName,
  userId,
  postCount,
  followingCountNumber,
  followerCountNumber,
  isFollowing: following,
}: ProfileInfoProps) => {
  const { user } = useClerk();
  const router = useRouter();
  const { onOpen } = useModal();
  const { isFollowing, setIsFollowing, followerCount, setFollowerCount } =
    useFollower();
  const { toast } = useToast();

  useEffect(() => {
    setIsFollowing(following);
    setFollowerCount(followerCountNumber);
  }, []);

  const onFollow = async () => {
    // Making req to api route to follow user
    try {
      setIsFollowing(true);
      setFollowerCount(followerCount + 1);

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
      setIsFollowing(false);
      setFollowerCount(followerCount - 1);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    }
  };

  const onFollowingModalOpen = () => {
    onOpen("following");
  };

  const onSettingsModalOpen = () => {
    onOpen("settings");
  };

  const onMoreHorizontalModalOpen = () => {
    onOpen("moreHorizontal");
  };

  const onDisplayFollowersModalOpen = () => {
    onOpen("displayFollowers");
  };

  const onDisplayFollowingsModalOpen = () => {
    onOpen("displayFollowings");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 justify-between flex-wrap md:pt-2 flex-col md:flex-row">
        <div>
          <span className="text-xl pr-2">{username}</span>
        </div>
        <div className="flex gap-2">
          {user?.username !== username ? (
            <Button
              onClick={isFollowing ? onFollowingModalOpen : onFollow}
              className="h-[2rem]"
              variant={isFollowing ? "default" : "amber"}
            >
              {isFollowing ? (
                <div className="flex items-center gap-1 font-semibold">
                  Following
                  <span>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </div>
              ) : (
                "Follow"
              )}
            </Button>
          ) : (
            <>
              <Link href={`/${userId}/edit`}>
                <Button
                  className="sm:h-[2rem] h-full whitespace-normal"
                  variant="default"
                >
                  Edit Profile
                </Button>
              </Link>
              <Link href="/archive">
                <Button
                  className="sm:h-[2rem] h-full whitespace-normal"
                  variant="default"
                >
                  View archive
                </Button>
              </Link>
            </>
          )}
          <button
            onClick={
              user?.username === username
                ? onSettingsModalOpen
                : onMoreHorizontalModalOpen
            }
            className="hidden md:block"
          >
            {user?.username === username ? <Settings /> : <MoreHorizontal />}
          </button>
        </div>
      </div>
      <div className="md:flex hidden gap-9 pt-1">
        <div className="tracking-[-0.5px] space-x-1">
          <span className="font-semibold">{postCount}</span>
          <span>posts</span>
        </div>
        <div
          onClick={onDisplayFollowersModalOpen}
          className="tracking-[-0.5px] space-x-1 flex items-center cursor-pointer active:text-muted-foreground"
        >
          <span className="font-semibold">{followerCount}</span>

          <span className="">followers</span>
        </div>
        <div
          onClick={onDisplayFollowingsModalOpen}
          className="tracking-[-0.5px] space-x-1 flex items-center cursor-pointer active:text-muted-foreground"
        >
          <span className="font-semibold">{followingCountNumber}</span>
          <span className="cursor-pointer">following</span>
        </div>
      </div>
      <div className="hidden md:block">
        <p className="font-semibold">{firstName}</p>
      </div>
    </div>
  );
};
