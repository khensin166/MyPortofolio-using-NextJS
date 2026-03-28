import React from "react";

export interface ScrambledTextProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText: React.FC<ScrambledTextProps> = ({
  className = "",
  style = {},
  children,
}) => {
  return (
    <div
      className={`font-mono text-[clamp(14px,4vw,32px)] text-foreground ${className}`}
      style={style}
    >
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
