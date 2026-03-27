"use client";

import { useState, useMemo } from "react";
import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useTranslations } from "next-intl";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import { IconResolver } from "@/common/utils/iconResolver";
import clsx from "clsx";

export type SkillItem = {
  id: number;
  title: string;
  category: string;
  imageSrc: string;
  isCoreSkill: boolean;
  color: string;
  tags?: string[];
};

interface SkillListProps {
  skills: SkillItem[];
}

const SkillList = ({ skills }: SkillListProps) => {
  const t = useTranslations("HomePage");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => {
    const allTags = skills.flatMap((skill) => skill.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    
    const tagCounts = uniqueTags.map((tag) => ({
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      rawValue: tag,
      count: skills.filter((skill) => skill.tags?.includes(tag)).length,
    }));

    return [
      { name: "All", rawValue: "All", count: skills.length },
      ...tagCounts,
    ];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedTag === "All") return skills;
    return skills.filter((skill) => skill.tags?.includes(selectedTag));
  }, [skills, selectedTag]);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("skills.title")} icon={<SkillsIcon />} />
        <SectionSubHeading>
          <p>{t("skills.sub_title")}</p>
        </SectionSubHeading>
      </div>

      <div className="flex flex-wrap gap-2 pb-4">
        {tags.map((tag) => (
          <button
            key={tag.rawValue}
            onClick={() => setSelectedTag(tag.rawValue)}
            className={clsx(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
              selectedTag === tag.rawValue
                ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            )}
          >
            <span>{tag.name}</span>
            <span className={clsx(
              "flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] rounded-full",
              selectedTag === tag.rawValue
                ? "bg-white/20 text-white"
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500"
            )}>
              {tag.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {filteredSkills.map((skill, index) => (
          <div
            key={index}
            className="group flex items-center gap-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 rounded-full transition-all duration-300 hover:border-amber-500/50 hover:bg-white dark:hover:bg-neutral-800 hover:shadow-md"
          >
            <div 
              style={{ color: skill.color || "currentColor" }}
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <IconResolver iconNameOrUrl={skill.imageSrc} size={20} />
            </div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[150px]">
              {skill.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillList;
