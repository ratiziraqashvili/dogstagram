import { CommentArray } from "@/types";
import { Like, Restrict } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "following" | "settings" | "moreHorizontal" | "displayFollowers" | "displayFollowings" | "aboutAccount" | "blockConfirm" | "blockIndicator" | "shareTo" | "createPost" | "postInfo" | "restrict" | "story"

type ModalStore = {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: any, likes?: Like[], comments?: CommentArray, savedPosts?: { postId: string }[], restrictedUsers?: Restrict[]) => void;
    onClose: () => void;
    data?: any;
    likes?: Like[];
    comments?: CommentArray;
    savedPostsId?: { postId: string }[];
    restrictedUsers?: Restrict[];
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type, data, likes, comments, savedPostsId, restrictedUsers) => set({ isOpen: true, type, data: data ?? null, likes: likes ?? undefined, comments: comments, savedPostsId: savedPostsId, restrictedUsers: restrictedUsers }),
    onClose: () => set({ type: null, isOpen: false, }),
}))
