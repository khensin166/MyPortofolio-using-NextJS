import React from "react";
import OverviewItem from "./OverviewItem";
import { useTranslations } from "next-intl";
import { FiEye, FiUsers, FiActivity, FiGlobe, FiZap } from "react-icons/fi";

interface OverviewProps {
  data: {
    websiteStats: {
      pageviews: {
        value: number;
      };
      visitors: {
        value: number;
      };
      visits: {
        value: number;
      };
      countries: {
        value: number;
      };
      events: {
        value: number;
      };
    };
  };
}

const Overview = ({ data }: OverviewProps) => {
  const t = useTranslations("DashboardPage.posthog.overview");

  const pageViewsData = data?.websiteStats?.pageviews?.value ?? 0;
  const visitorsData = data?.websiteStats?.visitors?.value ?? 0;
  const visitsData = data?.websiteStats?.visits?.value ?? 0;
  const countriesData = data?.websiteStats?.countries?.value ?? 0;
  const eventsData = data?.websiteStats?.events?.value ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 py-2">
      <OverviewItem
        label={t("page_views")}
        value={pageViewsData}
        icon={<FiEye />}
        accentColor="text-cyan-400"
        bgColor="bg-cyan-400/10"
      />
      <OverviewItem
        label={t("visitors")}
        value={visitorsData}
        icon={<FiUsers />}
        accentColor="text-violet-400"
        bgColor="bg-violet-400/10"
      />
    </div>
  );
};

export default Overview;

