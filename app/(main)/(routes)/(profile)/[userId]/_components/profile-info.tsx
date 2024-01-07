"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { ChevronDown, MoreHorizontal, Settings } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFollowingData } from "@/lib/following-data";

interface ProfileInfoProps {
  username: string | null;
  firstName: string | null;
  userId: string;
}

export const ProfileInfo = ({
  username,
  firstName,
  userId,
}: ProfileInfoProps) => {
  const { user } = useClerk();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const otherUserId = JSON.stringify(userId);

  const onFollow = async () => {
    // Making req to api route to follow user
    setIsLoading(true);
    try {
      await axios.post("/api/users/follow", otherUserId);

      setIsFollowing(true);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch following data
    const fetchFollowing = async () => {
      setIsLoading(true);
      try {
        const { followingIds } = await fetchFollowingData(userId);
        // Getting followingIds to display on profile

        setIsFollowing(followingIds.includes(userId));
      } catch (error) {
        console.error("Error fetching following data:", error);
        // Set button to say "Follow" instead of unfollow when user already dont follows
        setIsFollowing(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  useEffect(() => {
    // Fetch following data
    const fetchFollowing = async () => {
      try {
        const { followerCount, followingCount } = await fetchFollowingData(
          userId
        );
        // Getting followerCount and followingCount to display on profile

        setFollowerCount(followerCount || 0);
        setFollowingCount(followingCount || 0);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 md:gap-24 justify-between items-center md:pt-2 flex-col md:flex-row">
        <div>
          <span className="text-xl pr-2">{username}</span>
        </div>
        <div className="flex gap-4 ">
          {user?.username !== username ? (
            <Button
              disabled={isLoading}
              onClick={onFollow}
              className="h-[2rem]"
              variant={isFollowing ? "default" : "amber"}
            >
              {isFollowing ? (
              <div className="flex items-center gap-1">
                  Following
                  <span>
                    <ChevronDown className="h-4 w-4" />
                  </span>
              </div>
              ) : "Follow"}
            </Button>
          ) : (
            <Button className="h-[2rem]" variant="default">
              {/* TODO: see archived stories */}
              View archive
            </Button>
          )}
          <button>
            {user?.username === username ? <Settings /> : <MoreHorizontal />}
          </button>
        </div>
      </div>
      <div className="md:flex hidden gap-9 pt-1">
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">0</span> posts
        </div>
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">{followerCount}</span> followers
        </div>
        <div className="tracking-[-0.5px]">
          <span className="font-semibold">{followingCount}</span> following
        </div>
      </div>
      <div className="hidden md:block">
        <p className="lowercase font-bold">{firstName}</p>
      </div>
    </div>
  );
};
