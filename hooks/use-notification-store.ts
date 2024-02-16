import { create }from 'zustand';

type NotiStore = {
    unreadCount: number;
    setUnreadCount: (value: number) => void;
}

export const useNotificationStore = create<NotiStore>((set) => ({
  unreadCount: 0,
  setUnreadCount: (newCount: number) => set({ unreadCount: newCount }),
}));
