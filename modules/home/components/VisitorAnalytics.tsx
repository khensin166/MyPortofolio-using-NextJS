"use client";

import { useTranslations } from "next-intl";
import { FiUsers, FiGlobe, FiSmartphone, FiLink, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";

interface VisitorAnalyticsProps {
  data: {
    summary: {
      totalVisitors: number;
      totalCountries: number;
      topDevice: string;
      topSource: string;
    };
    topCountries: { country: string; count: number }[];
    topCities: { city: string; count: number }[];
  } | null;
}

const getCountryEmoji = (countryName: string) => {
  const map: Record<string, string> = {
    "Indonesia": "🇮🇩",
    "Malaysia": "🇲🇾",
    "Singapore": "🇸🇬",
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    "India": "🇮🇳",
    "Australia": "🇦🇺",
    "Japan": "🇯🇵",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Brazil": "🇧🇷"
  };
  return map[countryName] || "🌍";
};

const VisitorAnalytics = ({ data }: VisitorAnalyticsProps) => {
  const t = useTranslations("HomePage.analytics");

  if (!data) return null;

  const { summary, topCountries, topCities } = data;

  const summaryCards = [
    {
      title: t("total_visitors"),
      value: summary.totalVisitors,
      icon: <FiUsers className="w-4 h-4" />,
    },
    {
      title: t("countries"),
      value: summary.totalCountries,
      icon: <FiGlobe className="w-4 h-4" />,
    },
    {
      title: t("top_device"),
      value: summary.topDevice || "-",
      icon: <FiSmartphone className="w-4 h-4" />,
    },
    {
      title: t("top_source"),
      value: summary.topSource || "-",
      icon: <FiLink className="w-4 h-4" />,
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <SectionHeading title={t("title")} icon={<FiActivity />} />
        <SectionSubHeading>
          <p>{t("sub_title")}</p>
        </SectionSubHeading>
      </div>

      {/* Top Section: 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex flex-col space-y-2 p-5 bg-secondary/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              {card.icon}
              <span>{card.title}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section: 2 Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Visitor Countries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="p-5 bg-secondary/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("top_countries")}
          </h3>
          <div className="space-y-3">
            {topCountries.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4 text-center">
                  {index + 1}
                </span>
                <span className="text-xl">{getCountryEmoji(item.country)}</span>
                <span className="text-base font-medium text-foreground/90">
                  {item.country}
                </span>
              </div>
            ))}
            {topCountries.length === 0 && (
              <div className="text-sm text-muted-foreground">{t("no_data", { fallback: "No data available." })}</div>
            )}
          </div>
        </motion.div>

        {/* Top Visitor Cities */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="p-5 bg-secondary/40 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {t("top_cities")}
          </h3>
          <div className="space-y-3">
            {topCities.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4 text-center">
                  {index + 1}
                </span>
                <span className="text-xl">📍</span>
                <span className="text-base font-medium text-foreground/90">
                  {item.city}
                </span>
              </div>
            ))}
            {topCities.length === 0 && (
              <div className="text-sm text-muted-foreground">{t("no_data", { fallback: "No data available." })}</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisitorAnalytics;
