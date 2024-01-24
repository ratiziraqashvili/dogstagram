"use client";

import { Spinner } from "@/components/spinner";
import { useFollowingStore } from "@/hooks/use-following-store";
import { useModal } from "@/hooks/use-modal-store";
import { fetchFollowingData } from "@/lib/following-data";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MobileFollowerCount = () => {
  const {
    followerCount,
    followingCount,
    setFollowerCount,
    setFollowingCount,
  } = useFollowingStore();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const userId = pathname.slice(1);
  const { onOpen } = useModal();

  useEffect(() => {
    // Fetch following data
    const fetchFollowing = async () => {
      try {
        const following = await fetchFollowingData(userId);
        // Getting followerCount and followingCount to display on profile
        const followerCount = following.followerCount || 0;
        const followingCount = following.followingCount || 0;

        setFollowerCount(followerCount);
        setFollowingCount(followingCount);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  const onDisplayFollowersModalOpen = () => {
    onOpen("displayFollowers");
  };

  const onDisplayFollowingsModalOpen = () => {
    onOpen("displayFollowings")
  }

  return (
    <>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">0</span>
        <span className="text-muted-foreground">posts</span>
      </div>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">
          {isLoading ? (
            <div className="pb-[0.23rem]"><Spinner /></div>
          ) : (
            <span onClick={onDisplayFollowersModalOpen} className="font-semibold cursor-pointer">{followerCount}</span>
          )}
        </span>
        <span onClick={onDisplayFollowersModalOpen} className="text-muted-foreground cursor-pointer">followers</span>
      </div>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">
        {isLoading ? (
            <div className="pb-[0.23rem]"><Spinner /></div>
          ) : (
            <span onClick={onDisplayFollowingsModalOpen} className="font-semibold cursor-pointer">{followingCount}</span>
          )}
        </span>
        <span onClick={onDisplayFollowingsModalOpen}  className="text-muted-foreground cursor-pointer">following</span>
      </div>
    </>
  );
};
