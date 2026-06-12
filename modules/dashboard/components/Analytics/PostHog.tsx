"use client";

import useSWR from "swr";
import { SiPosthog as PostHogIcon } from "react-icons/si";
import { useTranslations } from "next-intl";

import PostHogSkeleton from "./PostHogSkeleton";
import TrafficTrendsChart from "./TrafficTrendsChart";
import Overview from "./Overview";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";
import EmptyState from "@/common/components/elements/EmptyState";
import { fetcher } from "@/services/fetcher";

const PostHog = () => {
  const key = `/api/posthog`;

  const { data, isLoading, error } = useSWR(key, fetcher);
  const t = useTranslations("DashboardPage");

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <SectionHeading title={t("posthog.title")} icon={<PostHogIcon />} />
          <SectionSubHeading>
            <p>{t("posthog.sub_title")}</p>
          </SectionSubHeading>
        </div>
      </div>

      {error ? (
        <EmptyState message={t("error")} />
      ) : isLoading ? (
        <PostHogSkeleton />
      ) : (
        <div className="space-y-6">
          <Overview data={data} />
          <TrafficTrendsChart data={data} />
        </div>
      )}
    </section>
  );
};

export default PostHog;
