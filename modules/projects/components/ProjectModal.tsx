"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose as CloseIcon } from "react-icons/io5";
import {
  HiOutlineArrowSmRight as LinkIcon,
  HiOutlineCode as CodeIcon,
} from "react-icons/hi";
import Link from "next/link";
import Image from "@/common/components/elements/Image";
import Portal from "@/common/components/elements/Portal";
import { ProjectItem } from "@/common/types/projects";
import { reactToProject } from "@/services/portfolio";

const MAX_VISIBLE_REACTIONS = 4;

interface ProjectModalProps {
  project: ProjectItem;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const {
    id,
    title,
    overview,
    description,
    imageSrc,
    tags,
    demoUrl,
    sourceUrl,
    type,
    category,
    reactions: initialReactions = {},
  } = project;

  const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
  const [reacted, setReacted] = useState<string | null>(null);
  const [showAllEmojis, setShowAllEmojis] = useState(false);

  const reactionEntries = Object.entries(reactions);
  const visibleReactions = reactionEntries.slice(0, MAX_VISIBLE_REACTIONS);
  const hiddenCount = reactionEntries.slice(MAX_VISIBLE_REACTIONS).reduce(
    (sum, [, count]) => sum + count,
    0
  );

  const handleReact = async (emoji: string) => {
    const wasReacted = reacted === emoji;
    const newReacted = wasReacted ? null : emoji;

    setReacted(newReacted);
    setReactions((prev) => ({
      ...prev,
      [emoji]: wasReacted
        ? Math.max((prev[emoji] || 0) - 1, 0)
        : (prev[emoji] || 0) + 1,
    }));

    try {
      await reactToProject(id, emoji);
    } catch (e) {
      // Revert on error
      setReacted(reacted);
      setReactions(initialReactions);
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative z-[10000] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
              >
                <CloseIcon size={20} />
              </button>

              {/* Image */}
              <div className="h-52 w-full overflow-hidden bg-muted md:h-64">
                <Image
                  src={imageSrc}
                  alt={title}
                  width={800}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
                {/* Header */}
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {category && <span>{category}</span>}
                    {type && category && <span>·</span>}
                    {type && <span>{type}</span>}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                {overview && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {overview}
                  </p>
                )}

                {/* Description */}
                {description && (
                  <p className="text-sm leading-relaxed text-foreground">
                    {description}
                  </p>
                )}

                {/* Reactions */}
                {reactionEntries.length > 0 && (
                  <div className="border-t border-border pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {visibleReactions.map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(emoji)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                            reacted === emoji
                              ? "border-primary/60 bg-primary/10 text-primary"
                              : "border-border bg-secondary text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{reactions[emoji] ?? count}</span>
                        </button>
                      ))}

                      {hiddenCount > 0 && (
                        <button
                          onClick={() => setShowAllEmojis(!showAllEmojis)}
                          className="flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
                        >
                          +{hiddenCount}
                        </button>
                      )}
                    </div>

                    {/* Expanded reactions */}
                    <AnimatePresence>
                      {showAllEmojis && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 flex flex-wrap gap-2 overflow-hidden"
                        >
                          {reactionEntries.slice(MAX_VISIBLE_REACTIONS).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReact(emoji)}
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 ${
                                reacted === emoji
                                  ? "border-primary/60 bg-primary/10 text-primary"
                                  : "border-border bg-secondary text-foreground hover:bg-muted"
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="font-medium">{reactions[emoji] ?? count}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Action links */}
                <div className="mt-auto flex gap-3 pt-2">
                  {demoUrl && (
                    <Link
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:scale-105 hover:bg-primary/90"
                    >
                      <span>Demo</span>
                      <LinkIcon size={16} />
                    </Link>
                  )}
                  {sourceUrl && (
                    <Link
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:scale-105 hover:bg-muted"
                    >
                      <span>Source</span>
                      <CodeIcon size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default ProjectModal;
