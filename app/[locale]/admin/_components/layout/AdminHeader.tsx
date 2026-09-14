"use client";

import { Menu } from "lucide-react";
import { useAdminUIStore } from "@/common/stores/adminUI";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function AdminHeader() {
  const { toggleSidebar } = useAdminUIStore();
  const { user } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-lg font-semibold text-foreground">Admin</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Bisa tambahkan avatar atau notifikasi di sini nanti */}
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
