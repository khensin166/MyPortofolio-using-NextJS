import { useTranslations } from "next-intl";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { convertToOrdinal } from "@/common/helpers";
import { MonkeytypeData } from "@/common/types/monkeytype";

interface LeaderboardProps {
  data: MonkeytypeData;
}

interface ItemProps {
  label: string;
  value: string;
  percent?: string;
}

const Leaderboard = ({ data }: LeaderboardProps) => {
  const t = useTranslations("DashboardPage.monkeytype");

  const Item = ({ label, value, percent }: ItemProps) => {
    const hasSuffix = /st|nd|rd|th$/.test(value);
    const number = hasSuffix ? value.slice(0, -2) : value;
    const suffix = hasSuffix ? value.slice(-2) : "";

    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-y-0.5">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {label} {t("unit_seconds")}
          </span>
          {percent ? (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {t("top")} {percent}%
            </span>
          ) : null}
        </div>
        <div className="flex gap-1">
          <span className="text-2xl text-primary">{number}</span>
          <span className="text-neutral-400">{suffix}</span>
        </div>
      </div>
    );
  };

  return (
    <SpotlightCard className="flex flex-col items-center justify-between gap-y-3 p-4 sm:flex-row sm:gap-y-1">
      <span className="text-sm text-neutral-600 dark:text-neutral-400">
        {t("title_leaderboard")}
      </span>
      {Object.entries(data.allTimeLbs.time).map(([time, lbData], index) => {
        const rank = lbData?.english?.rank;
        const count = lbData?.english?.count;
        const percent = rank && count ? (rank / count) * 100 : null;
        
        return (
          <Item
            key={index}
            label={time}
            value={rank ? convertToOrdinal(rank) : "-"}
            percent={percent ? percent.toFixed(2) : undefined}
          />
        );
      })}
    </SpotlightCard>
  );
};

export default Leaderboard;
