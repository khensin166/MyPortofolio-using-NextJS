"use client";

import { ReactNode, useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "next-themes";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Returns skeleton colors based on the current theme.
 * Forest is now a LIGHT theme (Snow White canvas), so skeleton uses warm stone tones.
 */
const getSkeletonColors = (theme: string | undefined) => {
  switch (theme) {
    case "light":
    case "forest": // Forest is a warm light theme — Warm Stone base, Snow White shimmer
      return { baseColor: "#eeeee9", highlightColor: "#fcfcf7" };
    case "dark":
    default:
      return { baseColor: "#171717", highlightColor: "#525252" };
  }
};

const SkeletonThemeProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const { baseColor, highlightColor } = getSkeletonColors(resolvedTheme);

  return (
    <SkeletonTheme
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={2}
    >
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonThemeProvider;
