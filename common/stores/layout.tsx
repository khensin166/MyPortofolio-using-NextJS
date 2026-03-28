import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayoutMode = "sidebar" | "topbar";

interface LayoutState {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleLayoutMode: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      layoutMode: "sidebar",
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleLayoutMode: () =>
        set((state) => ({
          layoutMode: state.layoutMode === "sidebar" ? "topbar" : "sidebar",
        })),
    }),
    {
      name: "layout-storage",
    },
  ),
);
