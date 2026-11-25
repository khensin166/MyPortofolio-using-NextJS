import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore, type AdminUser } from "@/common/stores/adminAuth";

/**
 * Hook untuk otentikasi Admin berbasis HttpOnly Cookie + verifikasi server (/api/admin-auth/me).
 */
export function useAdminAuth() {
  const router = useRouter();
  const { token, user, isAuthenticated, isHydrated, setAuth, clearAuth } =
    useAdminAuthStore();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin-auth/me", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!res.ok) {
        clearAuth();
        return false;
      }

      const data = await res.json();
      if (data?.authenticated && data?.user) {
        setAuth(data.user);
        return true;
      }

      clearAuth();
      return false;
    } catch {
      clearAuth();
      return false;
    }
  }, [setAuth, clearAuth]);

  const login = useCallback(
    (loggedInUser: AdminUser) => {
      setAuth(loggedInUser);
      router.push("/en/admin/inquiries");
    },
    [setAuth, router],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin-auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Ignore network error on logout
    }
    clearAuth();
    router.push("/en/admin/login");
  }, [clearAuth, router]);

  return {
    token,
    user,
    isAuthenticated,
    isLoading: !isHydrated,
    checkSession,
    login,
    logout,
  };
}
