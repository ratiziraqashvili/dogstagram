"use client"

import { fetchFollowingData } from "@/lib/following-data";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MobileFollowerCount = () => {
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const userId = pathname.slice(1);

    useEffect(() => {
        // Fetch following data
        const fetchFollowing = async () => {
          setIsLoading(true);
          try {
            const following = await fetchFollowingData(userId);
            // Getting followerCount and followingCount to display on profile
            const followerCount = following.followerCount || 0;
            const followingCount = following.followingCount || 0;
    
            setFollowerCount(followerCount)
            setFollowingCount(followingCount)
          } catch (error) {
            console.error("Error fetching following data:", error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchFollowing();
      }, [userId]);

    return (
        <>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">0</span>
                <span className="text-muted-foreground">posts</span>
            </div>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">{followerCount}</span>
                <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex flex-col items-center text-sm">
                <span className="font-semibold">{followingCount}</span>
                <span className="text-muted-foreground">following</span>
            </div>
        </>
    )
}