"use client";
import { useTheme } from "next-themes";
import { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

interface SkeletonLoaderProps {
  children: ReactNode;
}

/**
 * Returns skeleton colors based on the current theme.
 * Forest is now a LIGHT theme (Snow White canvas), so skeleton uses light tones.
 */
const getSkeletonColors = (theme: string | undefined) => {
  switch (theme) {
    case "light":
    case "forest": // Forest is a warm light theme — use warm stone tones
      return { baseColor: "#eeeee9", highlightColor: "#fcfcf7" };
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
