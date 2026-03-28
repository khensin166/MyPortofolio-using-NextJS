"use client";

import Image from "next/image";
import { useState } from "react";
import { BsBuildings as CompanyIcon } from "react-icons/bs";
import { HiChevronRight as ChevronIcon } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

import { EducationProps } from "@/common/types/education";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

const EducationCard = ({
  school,
  major,
  logo,
  degree,
  start_year,
  end_year,
  link,
  location,
  GPA,
  description,
}: EducationProps) => {
  const [isShowDetails, setIsShowDetails] = useState(false);
  const locale = useLocale();

  const hideText = locale === "en" ? "Hide" : "Sembunyikan";
  const showText = locale === "en" ? "Show" : "Tampilkan";
  const detailsText = locale === "en" ? "details" : "detail";

  return (
    <SpotlightCard className="flex items-start gap-5 p-6">
      {logo ? (
        <Image 
          width={70} 
          height={70} 
          src={logo} 
          alt={school} 
          className="shrink-0 aspect-square object-contain rounded-lg border-[1.5px] border-border bg-secondary"
        />
      ) : (
        <CompanyIcon size={65} className="shrink-0 text-muted-foreground" />
      )}

      <div className="w-full space-y-1">
        <a href={link || "#"} target="_blank" className="hover:underline">
          <h6>{school}</h6>
        </a>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 md:flex-row md:gap-2">
            <span>{degree}</span>
            <span className="hidden text-border md:block">
              •
            </span>
            <span>{major}</span>
            {GPA && (
              <div className="flex gap-2">
                <span className="hidden text-border md:block">
                  •
                </span>
                <span>GPA: </span>
                <span>{GPA}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-[12px] md:flex-row md:gap-2">
            <span className="text-muted-foreground">
              {start_year} - {end_year}
            </span>
            <span className="hidden rounded-full text-border md:block">
              •
            </span>
            <span>{location}</span>
          </div>

          {description && description.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setIsShowDetails(!isShowDetails)}
                className="-ml-1 flex items-center justify-center gap-x-1 transition duration-300 text-muted-foreground hover:text-foreground"
              >
                <motion.span
                  animate={{ rotate: isShowDetails ? 90 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <ChevronIcon size={18} />
                </motion.span>
                <p className="text-sm font-medium">
                  {isShowDetails ? hideText : showText} {detailsText}
                </p>
              </button>

              <AnimatePresence>
                {isShowDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-2 space-y-1 pl-5 text-[13px] leading-relaxed list-disc opacity-90">
                      {description.map((item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default EducationCard;
