"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { MENU_ITEMS } from "@/common/constants/menu";

const TopbarMenu = () => {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const currentPath = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
  const t = useTranslations("Navigation");

  const filteredMenu = MENU_ITEMS.filter((item) => item.isShow);

  return (
    <nav className="flex items-center gap-1 overflow-x-auto px-4 py-2 border-b border-border scrollbar-hide">
      {filteredMenu.map((item, index) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            className="relative px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <span className={isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
              {t(item.title)}
            </span>
            {isActive && (
              <motion.div
                layoutId="topbar-active"
                className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 -z-10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default TopbarMenu;
