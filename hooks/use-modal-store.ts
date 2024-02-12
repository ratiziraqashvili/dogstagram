import { CommentArray } from "@/types";
import { Like } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "following" | "settings" | "moreHorizontal" | "displayFollowers" | "displayFollowings" | "aboutAccount" | "blockConfirm" | "blockIndicator" | "shareTo" | "createPost" | "postInfo"

type ModalStore = {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: any, likes?: Like[], comments?: CommentArray, savedPosts?: { postId: string }[]) => void;
    onClose: () => void;
    data?: any;
    likes?: Like[];
    comments?: CommentArray;
    savedPostsId?: { postId: string }[]
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type, data, likes, comments, savedPostsId) => set({ isOpen: true, type, data: data ?? null, likes: likes ?? undefined, comments: comments, savedPostsId: savedPostsId }),
    onClose: () => set({ type: null, isOpen: false, }),
}))
