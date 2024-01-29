import { create } from "zustand";

interface PostDataStore {
    uploadedData: any;
    addUploadedData: (uploadedData: any) => void;
  }

export const usePostDataStore = create<PostDataStore>((set) => ({
    uploadedData: {},
    addUploadedData: (uploadedData: any) => set((state) => ({
        uploadedData: {
          ...state.uploadedData,
          ...uploadedData,
        },
      })),
}))