"use client";

import React from "react";
import AnimateCounter from "@/common/components/elements/AnimateCounter";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

interface OverviewItemProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  accentColor?: string; // e.g. "text-cyan-400", "text-violet-400"
  bgColor?: string;     // e.g. "bg-cyan-400/10"
}

const OverviewItem = ({
  label,
  value,
  unit = "",
  icon,
  accentColor = "text-primary",
  bgColor = "bg-primary/10",
}: OverviewItemProps) => {
  return (
    <SpotlightCard className="flex flex-col gap-3 p-4">
      {/* Icon bubble */}
      {icon && (
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bgColor} ${accentColor} text-lg`}>
          {icon}
        </div>
      )}

      <div className="space-y-0.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <AnimateCounter
            className={`text-2xl font-bold text-foreground`}
            total={value}
          />
          {unit && (
            <span className="text-xs font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default OverviewItem;

