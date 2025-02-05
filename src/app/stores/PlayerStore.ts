import { create } from "zustand";

interface PlayerState {
  nickname: string;
  setNickname: (nickname: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  nickname: "",
  setNickname: (nickname) => set({ nickname }),
}));
