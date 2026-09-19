"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Jangan track kunjungan jika berada di halaman Admin
    if (pathname.includes("/admin")) return;

    const trackVisit = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_ANALYSIS_API_URL || "https://porto-analysis.kenantomfie.com/api";
        await fetch(`${apiUrl}/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || "",
          }),
        });
      } catch (error) {
        // Suppress errors to prevent Next.js dev overlay from blocking the UI
        // console.error("Tracking failed:", error);
      }
    };

    trackVisit();
  }, [pathname, mounted]);

  return null;
}
