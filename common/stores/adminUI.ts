import { create } from "zustand";

interface AdminUIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  isSidebarOpen: false, // Default tertutup di mobile
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
