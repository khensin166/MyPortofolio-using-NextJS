import { useAdminAuthStore } from "../stores/adminAuth";

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Reusable API Client for the frontend.
 * - Jika requireAuth=true (default), meneruskan request via /api/admin-proxy/*
 *   sehingga JWT dikirim dari HttpOnly cookie di sisi server (tidak pernah terekspos ke browser).
 * - Otomatis logout & redirect ke /en/admin/login jika menerima 401/403.
 */
export const apiClient = async <T = any>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<{ data?: T; error?: string }> => {
  const { requireAuth = true, headers, ...customOptions } = options;

  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http")
    ? endpoint
    : requireAuth
      ? `/api/admin-proxy${normalizedEndpoint}`
      : `${BASE_URL}${normalizedEndpoint}`;

  const customHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Allow browser to automatically set Content-Type with boundary for FormData
  if (customOptions.body instanceof FormData) {
    delete customHeaders["Content-Type"];
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: customHeaders,
      credentials: requireAuth ? "same-origin" : customOptions.credentials,
      signal: customOptions.signal ?? AbortSignal.timeout(15000),
    });

    if (requireAuth && (response.status === 401 || response.status === 403)) {
      useAdminAuthStore.getState().clearAuth();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/en/admin/login";
      }
      return { error: "Session expired. Please sign in again." };
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "An error occurred while fetching data");
    }

    return { data: result.data !== undefined ? result.data : result };
  } catch (error: any) {
    return { error: error.message };
  }
};
