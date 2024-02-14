import { create } from "zustand";

type ModalStore = {
    isFollowing: boolean;
    setIsFollowing: (value: boolean) => void;
    followerCount: number;
    setFollowerCount: (value: number) => void;
}

export const useFollower = create<ModalStore>((set) => ({
    isFollowing: false,
    setIsFollowing: (isFollowing) => set({isFollowing}),
    followerCount: 0, 
    setFollowerCount: (count) => set({followerCount: count}) 
}))
