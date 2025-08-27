import { User } from "@/types";
import { create } from "zustand";

type userStoreType = {
  user: User | null;
  setInitialUser: (user: User) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  logout: () => void;
};

type feedStoreType = {
  users: User[];
  setUsers: (users: User[]) => void;
  appendUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  clearUsers: () => void;
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

const useFeedStore = create<feedStoreType>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  appendUsers(users) {
    set((state) => ({ users: [...state.users, ...users] }));
  },
  addUser(user) {
    set((state) => ({ users: [...state.users, user] }));
  },
  removeUser(userId) {
    set((state) => ({
      users: state.users.filter((user) => user._id !== userId),
    }));
  },
  clearUsers: () => set({ users: [] }),
}));

export { useUserStore, useFeedStore };
