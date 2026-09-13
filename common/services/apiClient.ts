import { useAdminAuthStore } from "../stores/adminAuth";

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/**
 * Reusable API Client for the frontend.
 * Automatically injects the JWT Bearer token if requireAuth is true.
 */
export const apiClient = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data?: T; error?: string }> => {
  const { requireAuth = true, headers, ...customOptions } = options;
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const customHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requireAuth) {
    const token = useAdminAuthStore.getState().token;
    if (token) {
      customHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: customHeaders,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "An error occurred while fetching data");
    }

    return { data: result.data || result };
  } catch (error: any) {
    return { error: error.message };
  }
};
