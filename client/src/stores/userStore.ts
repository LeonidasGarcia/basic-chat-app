import { create } from 'zustand';

interface UserStore {
  userId?: string;
  username?: string;
  setUser: (userId: string, username: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: undefined,
  username: undefined,
  setUser: (userId, username) => set(() => ({ userId, username })),
}));
