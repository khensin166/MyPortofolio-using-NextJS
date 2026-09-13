import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/common/stores/adminAuth";

/**
 * Hook untuk otentikasi Admin.
 * Menggunakan Zustand global store agar semua komponen (termasuk layout)
 * langsung bereaksi saat status login berubah - tanpa perlu refresh halaman.
 */
export function useAdminAuth() {
  const router = useRouter();
  const { token, user, isAuthenticated, isHydrated, setAuth, clearAuth } =
    useAdminAuthStore();

  const login = useCallback(
    (token: string, user: { id: string; name: string; email: string }) => {
      setAuth(token, user);
      router.push("/en/admin/inquiries");
    },
    [setAuth, router],
  );

  const logout = useCallback(() => {
    clearAuth();
    router.push("/en/admin/login");
  }, [clearAuth, router]);

  return {
    token,
    user,
    isAuthenticated,
    // isLoading sekarang bergantung pada hidrasi store Zustand dari localStorage
    isLoading: !isHydrated,
    login,
    logout,
  };
}
