import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAdminAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "portfolio_admin_auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
