"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataPoint {
  x: string;
  y: number;
}

interface DataProps {
  data: {
    pageviews: DataPoint[];
    sessions: DataPoint[];
  };
}

// PostHog returns labels like "2026-6-1" (non-padded), not proper ISO "2026-06-01".
// We parse them safely to avoid RangeError from date-fns parseISO.
const safeFormatLabel = (raw: string, fmt: "short" | "long"): string => {
  try {
    // Normalize "2026-6-1" → "2026-06-01"
    const parts = raw.split("-");
    if (parts.length === 3) {
      const normalized = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return raw;
      return fmt === "short"
        ? date.toLocaleString("en-US", { month: "short" })
        : date.toLocaleString("en-US", { month: "short", year: "numeric" });
    }
    // Already formatted string from PostHog (e.g. "Jun 12") — use as-is
    return raw;
  } catch {
    return raw;
  }
};

const TrafficTrendsChart = ({ data }: DataProps) => {
  const rawLabels = data?.pageviews?.map((point) => point.x) || [];
  const labels = rawLabels.map((label) => safeFormatLabel(label, "short"));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Visitors",
        data: data?.sessions?.map((point) => point.y) || [],
        backgroundColor: "rgba(255, 255, 184, 0.7)",
        stack: "traffic",
        borderRadius: 4,
      },
      {
        label: "Page views",
        data: data?.pageviews?.map((point) => point.y) || [],
        backgroundColor: "rgba(251, 228, 0, 0.7)",
        stack: "traffic",
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const raw = rawLabels[index];
            return raw ? safeFormatLabel(raw, "long") : "";
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[350px] w-full md:h-[400px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TrafficTrendsChart;
