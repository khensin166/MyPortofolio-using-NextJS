"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  RiSunFill,
  RiMoonClearFill,
  RiLeafFill,
} from "react-icons/ri";

const THEMES = [
  { name: "light", icon: <RiSunFill size={18} />, label: "Light" },
  { name: "dark", icon: <RiMoonClearFill size={18} />, label: "Dark" },
  { name: "forest", icon: <RiLeafFill size={18} />, label: "Nature" },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const activeIndex = THEMES.findIndex((t) => t.name === theme);

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center gap-1 rounded-full border border-border bg-secondary p-1 shadow-inner">
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute h-8 w-8 rounded-full bg-primary"
          animate={{
            x: activeIndex * 36,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {THEMES.map((t) => (
          <div
            key={t.name}
            className="relative"
            onMouseEnter={() => setHoveredTheme(t.name)}
            onMouseLeave={() => setHoveredTheme(null)}
          >
            {/* Tooltip — z-[10000] ensures it sits above ALL layers */}
            {hoveredTheme === t.name && (
              <motion.div
                className="pointer-events-none absolute bottom-full left-1/2 z-[10000] mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-100 dark:bg-neutral-100 dark:text-neutral-700 lg:block"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {t.label}
                {/* Small arrow */}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-800 dark:border-t-neutral-100" />
              </motion.div>
            )}

            <motion.button
              className={elative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 }
              onClick={() => setTheme(t.name)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-posthog-event={change_theme_}
            >
              {t.icon}
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
