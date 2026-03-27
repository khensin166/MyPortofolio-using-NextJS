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
              className="relative z-[10000] flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
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
              <div className="h-52 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 md:h-64">
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
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {title}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
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
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                {overview && (
                  <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {overview}
                  </p>
                )}

                {/* Description */}
                {description && (
                  <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {description}
                  </p>
                )}

                {/* Reactions */}
                {reactionEntries.length > 0 && (
                  <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center gap-2">
                      {visibleReactions.map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(emoji)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                            reacted === emoji
                              ? "border-primary/60 bg-primary/10 text-primary"
                              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{reactions[emoji] ?? count}</span>
                        </button>
                      ))}

                      {hiddenCount > 0 && (
                        <button
                          onClick={() => setShowAllEmojis(!showAllEmojis)}
                          className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
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
                                  : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
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
                      className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-dark transition hover:scale-105 hover:bg-primary/90"
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
                      className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:scale-105 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
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
