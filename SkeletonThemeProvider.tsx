"use client";

import { ReactNode, useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "next-themes";
import "react-loading-skeleton/dist/skeleton.css";

const getSkeletonColors = (theme: string | undefined) => {
  switch (theme) {
    case "light":
      return { baseColor: "#d4d4d4", highlightColor: "#f5f5f5" };
    case "forest":
      return { baseColor: "#24431a", highlightColor: "#366128" };
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
