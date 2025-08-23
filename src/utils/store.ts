import { User } from "@/types";
import { create } from "zustand";

type userStoreType = {
  user: User | null;
  setInitialUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  logout: () => void;
};

const useUserStore = create<userStoreType>((set, get) => ({
  user: null,
  setInitialUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
  isAuthenticated: () => !!get().user,
  logout: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
    }
  },
}));

export default useUserStore;
