import { create } from "zustand";

export type ModalType = "following" | "settings" | "moreHorizontal" | "displayFollowers" | "displayFollowings" | "aboutAccount" | "blockConfirm" | "blockIndicator" | "shareTo" | "createPost"

type ModalStore = {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: any) => void;
    onClose: () => void;
    data?: any
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type, data) => set({ isOpen: true, type, data: data ?? null }),
    onClose: () => set({ type: null, isOpen: false, }),
}))
