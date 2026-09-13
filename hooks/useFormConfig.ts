"use client";

import { useEffect, useState } from "react";
import type { FormConfig } from "@/common/types/discovery-form";
import { MOCK_FORM_CONFIG } from "@/common/constants/discovery-form-mock";

interface UseFormConfigResult {
  config: FormConfig | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook untuk fetch konfigurasi form aktif dari backend API.
 * Fallback ke MOCK_FORM_CONFIG jika API tidak tersedia (development / error).
 */
export function useFormConfig(): UseFormConfigResult {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      // Fallback ke mock jika env tidak ada
      setConfig(MOCK_FORM_CONFIG);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch(`${apiUrl}/form-config`, { signal: controller.signal })
      .then(async (res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        if (json.success && json.data) {
          setConfig(json.data as FormConfig);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.warn("[useFormConfig] Request timed out, using mock config");
        } else {
          console.warn("[useFormConfig] Failed to fetch form config:", err.message);
        }
        // Fallback ke mock agar form tetap berfungsi
        setConfig(MOCK_FORM_CONFIG);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return { config, isLoading, error };
}
