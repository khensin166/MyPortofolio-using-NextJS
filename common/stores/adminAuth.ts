import { create } from "zustand";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  /** Sentinel in-memory ("cookie-session") saat sesi HttpOnly valid; JWT asli tidak pernah disimpan di JS/localStorage */
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: AdminUser) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAdminAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user) =>
    set({
      token: "cookie-session",
      user,
      isAuthenticated: true,
      isHydrated: true,
    }),
  clearAuth: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    }),
  setHydrated: (value) => set({ isHydrated: value }),
}));
