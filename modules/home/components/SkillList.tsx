"use client";

import { useState, useMemo } from "react";
import { BiCodeAlt as SkillsIcon } from "react-icons/bi";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

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

      <div className="flex overflow-x-auto gap-2 pb-4 pt-1 md:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tags.map((tag) => (
          <button
            key={tag.rawValue}
            onClick={() => setSelectedTag(tag.rawValue)}
            className={clsx(
              "flex whitespace-nowrap items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border",
              selectedTag === tag.rawValue
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-secondary/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
            )}
          >
            <span>{tag.name}</span>
            <span className={clsx(
              "flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] rounded-full transition-colors",
              selectedTag === tag.rawValue
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {tag.count}
            </span>
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              layout
              key={skill.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 border rounded-full transition-all duration-300 backdrop-blur-md"
              style={{
                backgroundColor: `${skill.color}15`,
                borderColor: `${skill.color}40`,
              }}
              whileHover={{
                backgroundColor: `${skill.color}25`,
                borderColor: `${skill.color}80`,
                boxShadow: `0 8px 20px ${skill.color}20`,
                y: -2
              }}
            >
              {/* Icon Plate */}
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 dark:bg-white/70 backdrop-blur-md border border-border/40 shadow-inner overflow-hidden transition-all duration-300 group-hover:scale-110"
                style={{ 
                  filter: `drop-shadow(0 0 4px ${skill.color}60)` 
                }}
              >
                <div 
                  style={{ color: skill.color || "currentColor" }}
                  className="transition-all duration-300 group-hover:brightness-125"
                >
                  <IconResolver iconNameOrUrl={skill.imageSrc} size={18} />
                </div>
              </div>
              
              <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground truncate transition-colors duration-300">
                {skill.title}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default SkillList;
