import { create } from "zustand";

type FollowingStore = {
    isFollowing: boolean;
    followerCount: number;
    followingCount: number;
    setIsFollowing: (isFollowing: boolean) => void;
    setFollowerCount: (followerCount: number) => void;
    setFollowingCount: (followingCount: number) => void;
}

export const useFollowingStore = create<FollowingStore>((set) => ({
    isFollowing: false,
    followerCount: 0,
    followingCount: 0,
    setIsFollowing: (isFollowing) => set(() => ({ 
        isFollowing
     })),
     setFollowerCount: (followerCount) => set({ followerCount }),
     setFollowingCount: (followingCount) => set({ followingCount })
}))