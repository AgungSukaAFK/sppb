"use client";

import { create } from "zustand";

type store = {
  isLoading: boolean;
  showLoading: () => void;
  closeLoading: () => void;
};

export const useLoading = create<store>()((set) => ({
  isLoading: false,
  showLoading: () => set(() => ({ isLoading: true })),
  closeLoading: () => set({ isLoading: false }),
}));
