"use client";
import { useTheme } from "next-themes";
import { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonLoaderProps {
  children: ReactNode;
}

const getSkeletonColors = (theme: string | undefined) => {
  switch (theme) {
    case "light":
      return { baseColor: "#d4d4d4", highlightColor: "#f5f5f5" };
    case "forest":
      return { baseColor: "#24431a", highlightColor: "#366128" };
    case "dark":
    default:
      return { baseColor: "#202020", highlightColor: "#2e2e2e" };
  }
};

const SkeletonLoader = ({ children }: SkeletonLoaderProps) => {
  const { resolvedTheme } = useTheme();
  const { baseColor, highlightColor } = getSkeletonColors(resolvedTheme);

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      {children}
    </SkeletonTheme>
  );
};

export default SkeletonLoader;
