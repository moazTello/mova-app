import { authService } from "@/services/auth";
import { queryClient } from "@/services/queryClient";
import { tokenStorage } from "@/services/tokenStorage";
import { User } from "@/types/user";
import axios from "axios";
import { create } from "zustand";
type Status = "loading" | "guest" | "authenticated";

type AuthState = {
  user: User | null;
  status: Status;
  bootstrap: () => Promise<void>;
  setSession: (token: string, user: User, persist?: boolean) => Promise<void>;
  completeVerification: () => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearSession: () => Promise<void>;
};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",

  refreshUser: async () => {
    try {
      const user = await authService.me();
      set({ user });
      return user;
    } catch {
      return null;
    }
  },

  clearSession: async () => {
    queryClient.clear();
    await tokenStorage.clear();
    set({ user: null, status: "guest" });
  },
  bootstrap: async () => {
    const token = await tokenStorage.load();
    if (!token) return set({ status: "guest" });

    try {
      const user = await authService.me();
      set({ user, status: "authenticated" });
    } catch (e) {
      // منمسح التوكن بس إذا السيرفر رفضه، مو إذا انقطع النت
      const code = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (code === 401 || code === 403) await tokenStorage.clear();
      set({ user: null, status: "guest" });
    }
  },

  setSession: async (token, user, persist = true) => {
    await tokenStorage.set(token, persist);
    set({ user, status: "authenticated" });
  },

  completeVerification: async () => {
    const user = await authService.me();
    const token = tokenStorage.get();
    if (token) await tokenStorage.set(token, true);
    set({ user, status: "authenticated" });
    return user;
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {}
    await tokenStorage.clear();
    queryClient.clear();
    set({ user: null, status: "guest" });
  },
}));
