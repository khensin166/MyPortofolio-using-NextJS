"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAuthStore } from "@/common/stores/adminAuth";
import { Loader2, LogOut, LayoutDashboard, MessageSquare, Settings, Briefcase, GraduationCap, LayoutTemplate, Cpu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/en/admin", icon: LayoutDashboard },
  { name: "Inquiries", href: "/en/admin/inquiries", icon: MessageSquare },
  { name: "Projects", href: "/en/admin/projects", icon: LayoutTemplate },
  { name: "Skills", href: "/en/admin/skills", icon: Cpu },
  { name: "Experiences", href: "/en/admin/experiences", icon: Briefcase },
  { name: "Education", href: "/en/admin/education", icon: GraduationCap },
  { name: "Form Builder", href: "/en/admin/form-builder", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname?.includes("/admin/login");

  // Proteksi rute: arahkan ke login jika belum terotentikasi,
  // dan arahkan ke dasbor jika sudah login tapi mencoba mengakses halaman login.
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isLoginPage) {
        router.push("/en/admin/login");
      } else if (isAuthenticated && isLoginPage) {
        router.push("/en/admin/inquiries");
      }
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // Tampilkan spinner saat store sedang di-hidrasi dari localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika user sudah login tapi berada di halaman login, cegah render form login
  // Biarkan useEffect di atas melakukan redirect ke dasbor tanpa ada "kedipan"
  if (isAuthenticated && isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika user belum login dan mencoba mengakses halaman selain login, cegah render dasbor
  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika benar-benar di halaman login dan belum login, render form login saja
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card shadow-sm"
      >
        <div className="flex h-full flex-col px-4 py-6">
          {/* Brand */}
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Kenan Admin</h2>
            <p className="mt-1 text-sm text-muted-foreground">Portfolio Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map(({ name, href, icon: Icon }) => {
              const isActive = href === "/en/admin" 
                ? pathname === "/en/admin" || pathname === "/id/admin"
                : pathname?.includes(href);
              return (
                <Link
                  key={name}
                  href={href}
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
            <div className="mb-4 px-2">
              <p className="text-sm font-medium text-foreground">{user?.name || "Admin"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
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
      </motion.aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-5xl"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
