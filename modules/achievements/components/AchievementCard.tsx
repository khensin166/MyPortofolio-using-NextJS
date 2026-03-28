"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { IoClose as CloseIcon } from "react-icons/io5";
import { AchievementItem } from "@/common/types/achievements";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import Portal from "@/common/components/elements/Portal";
import Link from "next/link";

const AchievementCard = ({
  name,
  issuing_organization,
  issue_date,
  image,
  type,
  category,
  credential_id,
  url_credential,
  tags = [],
  categories = [],
}: AchievementItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("AchievementsPage");

  const issueDate = issue_date ? format(parseISO(issue_date), "MMMM yyyy") : "";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const allTags = [...new Set([...(tags || []), type])].filter(Boolean);
  const allCategories = [...new Set([...(categories || []), category])].filter(Boolean);

  return (
    <>
      <motion.div
        layoutId={`card-${image}`}
        onClick={() => setIsOpen(true)}
        className="h-full cursor-pointer"
      >
        <SpotlightCard className="group flex h-full flex-col overflow-hidden border border-border">
          <div className="relative overflow-hidden">
            <motion.div layoutId={`image-${image}`}>
              <Image
                src={image}
                alt={name}
                width={500}
                height={250}
                className="min-h-[180px] w-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105 md:h-[170px]"
              />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-sm font-medium">View detail</span>
              <ViewIcon size={20} />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
            <div className="space-y-2">
              {credential_id && (
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {credential_id}
                </p>
              )}
              <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors duration-300">
                {name}
              </h3>
              <p className="text-xs text-muted-foreground/80">
                {issuing_organization}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <span key={index} className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground transition-all duration-300 hover:bg-muted">
                    {tag}
                  </span>
                ))}
                {allCategories.map((cat, index) => (
                  <span key={index} className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] capitalize text-muted-foreground transition-all duration-300 hover:bg-muted">
                    {cat}
                  </span>
                ))}
              </div>

              <div className="border-t border-border pt-2">
                <p className="text-[10px] uppercase text-muted-foreground">
                  Issued on {issueDate}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
              {/* Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              <motion.div
                layoutId={`card-${image}`}
                className="relative z-[10000] flex max-w-6xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 z-[10001] rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
                >
                  <CloseIcon size={20} />
                </button>

                <div className="flex flex-col md:flex-row">
                  <div className="w-full bg-secondary">
                    <motion.div layoutId={`image-${image}`}>
                      <Image
                        src={image}
                        alt={name}
                        width={1000}
                        height={700}
                        className="h-full max-h-[70vh] w-full object-contain md:max-h-[85vh]"
                      />
                    </motion.div>
                  </div>

                  <div className="w-90 hidden flex-col border-l border-border py-4 pl-8 pr-20 md:flex">
                    <h2 className="text-lg font-bold text-foreground">
                      {name}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {issuing_organization}
                    </p>
                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          Credential ID
                        </p>
                        <p className="text-sm text-foreground">
                          {credential_id || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          {allTags.length > 1 ? "Types" : "Type"}
                        </p>
                        <p className="text-sm capitalize text-foreground">
                          {allTags.join(", ") || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          {allCategories.length > 1 ? "Categories" : "Category"}
                        </p>
                        <p className="text-sm capitalize text-foreground">
                          {allCategories.join(", ") || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          Issue Date
                        </p>
                        <p className="text-sm text-foreground">
                          {issueDate}
                        </p>
                      </div>
                    </div>

                    {url_credential && (
                      <Link
                        href={url_credential}
                        className="mt-6 flex w-fit justify-between gap-2 rounded-full bg-primary px-3 py-3 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
                      >
                        <p className="text-sm ">Credential URL</p>
                        <ViewIcon size={20} className=" " />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default AchievementCard;
