import { Comment, Like } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "following" | "settings" | "moreHorizontal" | "displayFollowers" | "displayFollowings" | "aboutAccount" | "blockConfirm" | "blockIndicator" | "shareTo" | "createPost" | "postInfo"

type ModalStore = {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: any, likes?: Like[], comments?: Comment[]) => void;
    onClose: () => void;
    data?: any;
    likes?: Like[];
    comments?: Comment[];
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type, data, likes, comments) => set({ isOpen: true, type, data: data ?? null, likes: likes ?? undefined, comments: comments }),
    onClose: () => set({ type: null, isOpen: false, }),
}))
