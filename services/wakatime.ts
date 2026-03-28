import { WAKATIME_ACCOUNT } from "@/common/constants/wakatime";
import axios from "axios";
import { unstable_cache } from "next/cache";

const { api_key, base_url, all_time_endpoint, stats_endpoint } =
  WAKATIME_ACCOUNT;

const fetchReadStats = async () => {
  try {
    const response = await axios.get(
      `${base_url}${stats_endpoint}/last_7_days`,
      {
        headers: { Authorization: `Basic ${api_key}` },
      },
    );

    const getData = response.data;
    return {
      data: {
        start_date: getData?.data?.start,
        end_date: getData?.data?.end,
        last_update: getData?.data?.modified_at,
        best_day: {
          date: getData?.data?.best_day?.date,
          text: getData?.data?.best_day?.text,
        },
        human_readable_daily_average:
          getData?.data?.human_readable_daily_average_including_other_language,
        human_readable_total:
          getData?.data?.human_readable_total_including_other_language,
        languages: getData?.data?.languages?.slice(0, 6),
        editors: getData?.data?.editors,
      },
    };
  } catch (error) {
    console.error("Wakatime Stats Error:", error);
    return { data: {} as any };
  }
};

const fetchAllTimeSinceToday = async () => {
  try {
    const response = await axios.get(`${base_url}${all_time_endpoint}`, {
      headers: { Authorization: `Basic ${api_key}` },
    });

    const getData = response.data;
    return {
      data: {
        text: getData?.data?.text,
        total_seconds: getData?.data?.total_seconds,
      },
    };
  } catch (error) {
    console.error("Wakatime All Time Error:", error);
    return { data: {} as any };
  }
};

export const getReadStats = unstable_cache(
  async () => fetchReadStats(),
  ["wakatime-read-stats-key"],
  { revalidate: 3600, tags: ["wakatime-stats-tag"] },
);

export const getAllTimeSinceToday = unstable_cache(
  async () => fetchAllTimeSinceToday(),
  ["wakatime-all-time-key"],
  { revalidate: 3600, tags: ["wakatime-all-time-tag"] },
);
