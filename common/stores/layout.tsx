import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayoutMode = "sidebar" | "topbar";

interface LayoutState {
  layoutMode: LayoutMode;
  isHydrated: boolean;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
  setHydrated: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layoutMode: "sidebar",
      isHydrated: false,
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleLayoutMode: () =>
        set((state) => ({
          layoutMode: state.layoutMode === "sidebar" ? "topbar" : "sidebar",
        })),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "layout-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
