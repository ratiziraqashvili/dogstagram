"use client";

import { useFollower } from "@/hooks/use-follower-store";
import { useModal } from "@/hooks/use-modal-store";

interface MobileFollowerCountProps {
  postCount: number;
  followerCountNumber: number;
  followingCountNumber: number;
}

export const MobileFollowerCount = ({
  postCount,
  followerCountNumber,
  followingCountNumber,
}: MobileFollowerCountProps) => {
  const { onOpen } = useModal();
  const { followerCount } = useFollower();

  const onDisplayFollowersModalOpen = () => {
    onOpen("displayFollowers");
  };

  const onDisplayFollowingsModalOpen = () => {
    onOpen("displayFollowings");
  };

  return (
    <>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">{postCount}</span>
        <span className="text-muted-foreground">posts</span>
      </div>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">
          <span
            onClick={onDisplayFollowersModalOpen}
            className="font-semibold cursor-pointer"
          >
            {followerCount}
          </span>
        </span>
        <span
          onClick={onDisplayFollowersModalOpen}
          className="text-muted-foreground cursor-pointer"
        >
          followers
        </span>
      </div>
      <div className="flex flex-col items-center text-sm">
        <span className="font-semibold">
          <span
            onClick={onDisplayFollowingsModalOpen}
            className="font-semibold cursor-pointer"
          >
            {followingCountNumber}
          </span>
        </span>
        <span
          onClick={onDisplayFollowingsModalOpen}
          className="text-muted-foreground cursor-pointer"
        >
          following
        </span>
      </div>
    </>
  );
};
