"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { AchievementItem } from "@/common/types/achievements";
import { fetcher } from "@/services/fetcher";

import EmptyState from "@/common/components/elements/EmptyState";
import AchievementCard from "./AchievementCard";
import AchievementSkeleton from "./AchievementSkeleton";
import FilterHeader from "./FilterHeader";

const Achievements = () => {
  const t = useTranslations("AchievementsPage");

  const params = useSearchParams();

  const type = params.get("type");
  const category = params.get("category");
  const search = params.get("search");

  const { data: categoriesResponse } = useSWR(
    "/api/achievements/categories",
    fetcher,
  );
  const { data: typesResponse } = useSWR("/api/achievements/types", fetcher);

  const categories = useMemo(() => {
    const data = Array.isArray(categoriesResponse) ? categoriesResponse : [];
    return ["All", ...data];
  }, [categoriesResponse]);

  const types = useMemo(() => {
    const data = Array.isArray(typesResponse) ? typesResponse : [];
    return ["All", ...data];
  }, [typesResponse]);

  const queryParams = new URLSearchParams();
  if (category && category !== "All") queryParams.append("category", category);
  if (type && type !== "All") queryParams.append("type", type);
  if (search) queryParams.append("search", search);

  const apiUrl = `/api/achievements${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const { data, isLoading, error } = useSWR(apiUrl, fetcher);
  
  const filteredAchievements: AchievementItem[] = useMemo(() => {
    const rawData = data || [];
    return rawData
      .filter((item: AchievementItem) => {
        const matchesShow = item?.is_show;
        
        // Multi-tag support for category
        const matchesCategory = !category || category === "All" || 
          item?.categories?.includes(category) || item?.category === category;
          
        // Multi-tag support for type
        const matchesType = !type || type === "All" || 
          item?.tags?.includes(type) || item?.type === type;
          
        return matchesShow && matchesType && matchesCategory;
      })
      .sort((a: AchievementItem, b: AchievementItem) => {
        const dateA = a.issue_date || "";
        const dateB = b.issue_date || "";
        return dateB.localeCompare(dateA);
      });
  }, [data, category, type]);

  return (
    <section className="space-y-4">
      <FilterHeader
        categoryOptions={categories}
        typeOptions={types}
        totalData={data?.length}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <AchievementSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <EmptyState message={t("error")} />}

      {filteredAchievements?.length === 0 && (
        <EmptyState message={t("no_data")} />
      )}

      {!isLoading && !error && filteredAchievements?.length !== 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredAchievements?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AchievementCard {...item} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Achievements;
