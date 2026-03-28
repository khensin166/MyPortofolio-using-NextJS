"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  RiSunFill,
  RiMoonClearFill,
  RiLeafFill,
} from "react-icons/ri";

import Tooltip from "../../elements/Tooltip";

const THEMES = [
  { name: "light", icon: <RiSunFill size={18} />, label: "Light" },
  { name: "dark", icon: <RiMoonClearFill size={18} />, label: "Dark" },
  { name: "forest", icon: <RiLeafFill size={18} />, label: "Nature" },
];

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const activeIndex = THEMES.findIndex((t) => t.name === theme);

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center gap-1 rounded-full border border-border bg-secondary p-1 shadow-inner md:gap-2">
        {/* Animated Background Indicator */}
        <motion.div
          className="absolute h-8 w-8 rounded-full bg-primary shadow-lg"
          animate={{
            x: activeIndex * (typeof window !== 'undefined' && window.innerWidth < 768 ? 36 : 40),
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {THEMES.map((t, index) => (
          <Tooltip key={t.name} title={t.label}>
            <motion.button
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${
                theme === t.name
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTheme(t.name)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-umami-event={`change_theme_${t.name}`}
            >
              {t.icon}
            </motion.button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
