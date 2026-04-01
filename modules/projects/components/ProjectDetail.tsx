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
  description,
  features,
  type,
  category,
  reactions: initialReactions = {},
}: ProjectItem) => {
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
          <span className="mb-1 text-sm text-foreground">
            {t("tech_stack")} :{" "}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {tags?.map((stack: string, index: number) => {
              const stackData = STACKS[stack];
              return (
                <Tooltip title={stack} key={index}>
                  <div className={`${stackData?.color || "text-muted-foreground"}`}>
                    {STACKS[stack]?.icon || (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs">
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
      {/* Type & Category badges */}
      {(() => {
        const cats = Array.isArray(category) ? category : category ? [category] : [];
        const types = Array.isArray(type) ? type : type ? [type] : [];
        const items = [...cats, ...types];
        if (items.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
              <span key={i} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground whitespace-nowrap font-medium">
                {item}
              </span>
            ))}
          </div>
        );
      })()}

      

      {/* Reactions */}
      <div className="flex flex-wrap items-center gap-2">
        {activeReactions.map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all hover:scale-105 active:scale-95 ${
              reacted === emoji
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-secondary text-foreground hover:bg-muted"
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition hover:border-foreground hover:text-foreground"
          >
            <span className="text-sm leading-none">+</span>
          </button>

          {showPicker && (
            <div className="absolute bottom-10 left-0 z-50 flex gap-1.5 rounded-2xl border border-border bg-card p-2 shadow-lg">
              {ALL_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`rounded-full p-1.5 text-xl transition-all hover:scale-125 ${
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


      {/* Features List */}
      {features && features.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
            <span className="text-primary text-2xl">✨</span> Key Features
          </h3>
          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />
                <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
