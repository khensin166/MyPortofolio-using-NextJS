"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Tooltip from "@/common/components/elements/Tooltip";
import Image from "@/common/components/elements/Image";
import MDXComponent from "@/common/components/elements/MDXComponent";
import { ProjectItem } from "@/common/types/projects";
import { STACKS } from "@/common/constants/stacks";
import { reactToProject } from "@/services/portfolio";

import ProjectLink from "./ProjectLink";

const ALL_EMOJIS = ["✨", "🎇", "💘", "🔥", "🫨"];

const ProjectDetail = ({
  id,
  title,
  imageSrc,
  tags,
  demoUrl,
  sourceUrl,
  content,
  type,
  category,
  reactions: initialReactions = {},
}: ProjectItem & { content?: string }) => {
  const t = useTranslations("ProjectsPage");

  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [reacted, setReacted] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const activeReactions = Object.entries(reactions).filter(([, count]) => count > 0);

  const handleReact = async (emoji: string) => {
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

  return (
    <div className="space-y-8">
      {/* Header: Tech Stack + Links */}
      <div className="flex flex-col items-center justify-between gap-5 sm:flex-row lg:flex-row lg:items-start">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mb-1 text-sm text-neutral-700 dark:text-neutral-300">
            {t("tech_stack")} :{" "}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {tags?.map((stack: string, index: number) => {
              const stackData = STACKS[stack];
              return (
                <Tooltip title={stack} key={index}>
                  <div className={`${stackData?.color || "text-neutral-500"}`}>
                    {STACKS[stack]?.icon || (
                      <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-700">
                        {stack}
                      </span>
                    )}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
        <ProjectLink
          title={title}
          link_demo={demoUrl || ""}
          link_github={sourceUrl || ""}
        />
      </div>
{/* Project Image */}
      <div className="overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={title}
          width={1000}
          height={400}
          className="transition duration-500 hover:scale-[1.04]"
        />
      </div>
      {/* Type & Category badges */}
      {(type || category) && (
        <div className="flex flex-wrap gap-2">
          {category && (
            <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {category}
            </span>
          )}
          {type && (
            <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {type}
            </span>
          )}
        </div>
      )}

      

      {/* Reactions */}
      <div className="flex flex-wrap items-center gap-2">
        {activeReactions.map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all hover:scale-105 active:scale-95 ${
              reacted === emoji
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            <span>{emoji}</span>
            <span className="font-medium">{reactions[emoji] ?? count}</span>
          </button>
        ))}

        {/* Emoji Picker */}
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-400 transition hover:border-neutral-400 hover:text-neutral-600 dark:border-neutral-600 dark:text-neutral-500"
          >
            <span className="text-sm leading-none">+</span>
          </button>

          {showPicker && (
            <div className="absolute bottom-10 left-0 z-50 flex gap-1.5 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              {ALL_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`rounded-full p-1.5 text-xl transition-all hover:scale-125 ${
                    reacted === emoji ? "bg-primary/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MDX Content */}
      {content ? (
        <div className="mt-5 space-y-6 leading-[1.8] dark:text-neutral-300">
          <MDXComponent>{content}</MDXComponent>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectDetail;
