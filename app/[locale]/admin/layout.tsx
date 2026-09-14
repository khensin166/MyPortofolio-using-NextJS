"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAuthStore } from "@/common/stores/adminAuth";
import { AdminLayoutClient } from "./_components/layout/AdminLayoutClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Jika user sudah login tapi berada di halaman login, cegah render form login
  // Biarkan useEffect di atas melakukan redirect ke dasbor tanpa ada "kedipan"
  if (isAuthenticated && isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Jika user belum login dan mencoba mengakses halaman selain login, cegah render dasbor
  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Jika benar-benar di halaman login dan belum login, render form login saja
  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
