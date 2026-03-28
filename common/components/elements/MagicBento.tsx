import React, { useRef, useEffect, useState } from "react";
import "@/common/styles/MagicBento.css";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  children: React.ReactNode;
  textAutoHide?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableBorderGlow?: boolean;
  items: BentoCardProps[];
}

const MOBILE_BREAKPOINT = 768;

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section relative grid select-none gap-2"
    style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }}
    // ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableBorderGlow = true,
  items,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  return (
      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {items.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? "card--border-glow" : ""
            }`;

            const cardStyle = {
              backgroundColor: card.color || "var(--background-dark)",
              borderColor: "var(--border-color)",
              color: "white",
            } as React.CSSProperties;

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
              >
                <div className="card__header relative flex justify-between gap-3 text-white">
                  <span className="card__label text-base">{card.label}</span>
                </div>
                <div>{card.children}</div>
                <div className="card__content relative flex flex-col text-white">
                  <h3
                    className={`card__title m-0 mb-1 text-base font-normal ${textAutoHide ? "text-clamp-1" : ""}`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`card__description text-xs leading-5 opacity-90 ${textAutoHide ? "text-clamp-2" : ""}`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
  );
};

export default MagicBento;
