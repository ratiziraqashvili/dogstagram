import { create } from "zustand";

type FollowingStore = {
    isFollowing: boolean;
    setIsFollowing: (isFollowing: boolean) => void;
}

export const useFollowingStore = create<FollowingStore>((set) => ({
    isFollowing: false,
    setIsFollowing: (isFollowing) => set((state) => ({ 
        isFollowing
     }))
}))