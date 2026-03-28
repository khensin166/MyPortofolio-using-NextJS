"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LuChevronsUpDown as ArrowIcon } from "react-icons/lu";
import { TiTick as ActiveIcon } from "react-icons/ti";
import { MdArrowOutward as LinkIcon } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import cn from "@/common/libs/clsxm";
import Button from "@/common/components/elements/Button";
import { UMAMI_ACCOUNT } from "@/common/constants/umami";

const ComboBoxFilter = () => {
  const t = useTranslations("DashboardPage.umami");
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainParams = searchParams.get("domain") || "all";

  const [isOpen, setIsOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(domainParams);

  const comboBoxRef = useRef<HTMLDivElement>(null);
  const { websites } = UMAMI_ACCOUNT;

  const handleSelect = (newValue: string) => {
    setSelectValue(newValue);
    setIsOpen(false);
    router.push(`/dashboard?domain=${newValue}`, { scroll: false });
  };

  useEffect(() => {
    setSelectValue(domainParams);
  }, [domainParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboBoxRef.current &&
        !comboBoxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = selectValue === "all" ? t("all") : selectValue;

  return (
    <div ref={comboBoxRef} className="relative w-full md:w-[230px]">
      <Button
        className="flex w-full items-center justify-between gap-4 bg-secondary p-2 text-foreground outline outline-border hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">{displayLabel}</span>
        <ArrowIcon
          className={cn("transition duration-200", isOpen && "rotate-180")}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-12 z-10 w-full rounded-md border border-border bg-card shadow-xl"
          >
            <div className="space-y-1 p-1">
              <button
                className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-foreground hover:bg-muted"
                onClick={() => handleSelect("all")}
              >
                <div className="w-4">
                  {selectValue === "all" && <ActiveIcon size={16} />}
                </div>
                <span>{t("all")}</span>
              </button>

              <div className="my-1 h-[1px] bg-border" />

              {websites.map((item, index) => (
                <div key={index} className="group flex items-center gap-1">
                  <button
                    className="flex flex-grow items-center gap-2 rounded-md p-2 text-left text-sm text-foreground hover:bg-muted"
                    onClick={() => handleSelect(item.domain)}
                  >
                    <div className="w-4">
                      {selectValue === item.domain && <ActiveIcon size={16} />}
                    </div>
                    <span className="truncate">{item.domain}</span>
                  </button>

                  <a
                    href={item.umami_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <LinkIcon size={14} />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComboBoxFilter;
