"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { TbPinnedFilled as PinIcon } from "react-icons/tb";

import Image from "@/common/components/elements/Image";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { ProjectItem } from "@/common/types/projects";
import { reactToProject } from "@/services/portfolio";

const ALL_EMOJIS = ["✨", "🎇", "💘", "🔥", "🫨"];

const ProjectCard = (project: ProjectItem) => {
  const { id, title, overview, description, imageSrc, tags, isFeatured, reactions: initialReactions = {} } = project;
  const t = useTranslations("ProjectsPage");

  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [reacted, setReacted] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const previewText = overview || (Array.isArray(description) ? description[0] : (description || ""));
  const trimmedContent = previewText.slice(0, 85) + (previewText.length > 85 ? "..." : "");

  // Only show reactions with count > 0
  const activeReactions = Object.entries(reactions).filter(([, count]) => count > 0);

  const handleReact = async (e: React.MouseEvent, emoji: string) => {
    e.preventDefault();
    e.stopPropagation();

    const wasReacted = reacted === emoji;
    setReacted(wasReacted ? null : emoji);
    setReactions((prev) => ({
      ...prev,
      [emoji]: wasReacted ? Math.max((prev[emoji] || 0) - 1, 0) : (prev[emoji] || 0) + 1,
    }));
    setShowPicker(false);

    try {
      await reactToProject(id, emoji);
    } catch {
      setReacted(reacted);
      setReactions(initialReactions);
    }
  };

  const projectSlug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative flex h-full flex-col">
      <Link href={`/projects/${projectSlug}`} className="block h-full">
        <SpotlightCard className="group relative flex h-full cursor-pointer flex-col overflow-hidden border border-border">
          {isFeatured && (
            <div className="absolute right-0 top-0 z-10 flex items-center gap-x-1 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
              <PinIcon size={15} />
              <span>Featured</span>
            </div>
          )}
          <div className="relative">
            <Image
              src={imageSrc}
              alt={title}
              width={450}
              height={200}
              className="h-[200px] w-full rounded-t-xl object-cover"
            />
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-1 rounded-t-xl bg-black text-sm font-medium text-neutral-50 opacity-0 transition-opacity duration-300 group-hover:opacity-80">
              <span>{t("view_project")}</span>
              <ViewIcon size={20} />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
            <div className="space-y-2">
              <h3 className="cursor-pointer text-foreground transition-all duration-300 group-hover:text-primary">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {trimmedContent}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {tags?.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Reaction Row */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
              {activeReactions.map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={(e) => handleReact(e, emoji)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition-all hover:scale-105 active:scale-95 ${
                    reacted === emoji
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border bg-secondary text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="font-medium">{reactions[emoji] ?? count}</span>
                </button>
              ))}

              {/* + Button for emoji picker */}
              <div ref={pickerRef} className="relative ml-auto">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker((v) => !v);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition hover:border-foreground hover:text-foreground"
                >
                  <span className="text-sm leading-none">+</span>
                </button>

                {showPicker && (
                  <div
                    className="absolute bottom-9 right-0 z-50 flex gap-1.5 rounded-2xl border border-border bg-card p-2 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {ALL_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={(e) => handleReact(e, emoji)}
                        className={`rounded-full p-1.5 text-lg transition-all hover:scale-125 ${
                          reacted === emoji ? "bg-primary/10" : "hover:bg-muted"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </div>
  );
};

export default ProjectCard;
