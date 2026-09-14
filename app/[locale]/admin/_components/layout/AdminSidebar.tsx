"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, MessageSquare, Settings, Briefcase, GraduationCap, LayoutTemplate, Cpu, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminUIStore } from "@/common/stores/adminUI";
import ThemeSwitcher from "@/common/components/elements/ThemeSwitcher";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/en/admin", icon: LayoutDashboard },
  { name: "Inquiries", href: "/en/admin/inquiries", icon: MessageSquare },
  { name: "Projects", href: "/en/admin/projects", icon: LayoutTemplate },
  { name: "Skills", href: "/en/admin/skills", icon: Cpu },
  { name: "Experiences", href: "/en/admin/experiences", icon: Briefcase },
  { name: "Education", href: "/en/admin/education", icon: GraduationCap },
  { name: "Form Builder", href: "/en/admin/form-builder", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAdminAuth();
  const { isSidebarOpen, setSidebarOpen } = useAdminUIStore();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside
        className={`fixed left-0 top-0 z-50 h-[100dvh] w-64 border-r border-border bg-card shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-6">
          {/* Brand & Mobile Close Button */}
          <div className="mb-8 px-2 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-primary">Kenan Admin</h2>
              <p className="mt-1 text-sm text-muted-foreground">Portfolio Management</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
            {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
              const isActive = href === "/en/admin" 
                ? pathname === "/en/admin" || pathname === "/id/admin"
                : pathname?.includes(href);
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setSidebarOpen(false)} // Auto close on mobile after clicking
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="mt-auto border-t border-border pt-4">
            <div className="mb-4 px-2 flex items-center justify-between">
              <div className="overflow-hidden pr-2">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || "Admin"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="shrink-0">
                <ThemeSwitcher />
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
