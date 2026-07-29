"use client";

import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

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

// Normalize "2026-6-1" → "12 Jun" (day + short month)
const safeFormatLabel = (raw: string, fmt: "day" | "long"): string => {
  try {
    const parts = raw.split("-");
    if (parts.length === 3) {
      const normalized = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return raw;
      if (fmt === "day") {
        return date.toLocaleString("en-US", { day: "numeric", month: "short" });
      }
      return date.toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric" });
    }
    return raw;
  } catch {
    return raw;
  }
};

const TrafficTrendsChart = ({ data }: DataProps) => {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [filter, setFilter] = useState<"all" | "30days">("30days");

  const filterData = (points: DataPoint[] = []) => {
    if (filter === "all") return points;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Ignore time for comparison
    return points.filter((p) => {
      const parts = p.x.split("-");
      if (parts.length === 3) {
        const normalized = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
        const pointDate = new Date(normalized);
        return !isNaN(pointDate.getTime()) && pointDate >= thirtyDaysAgo;
      }
      return true;
    });
  };

  const filteredPageviews = filterData(data?.pageviews);
  const filteredSessions = filterData(data?.sessions);

  const rawLabels = filteredPageviews.map((point) => point.x);
  const labels = rawLabels.map((l) => safeFormatLabel(l, "day"));

  const pageviewValues = filteredPageviews.map((p) => p.y);
  const sessionValues = filteredSessions.map((p) => p.y);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Page Views",
        data: pageviewValues,
        borderColor: "rgba(99, 202, 255, 1)",
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(99, 202, 255, 0.1)";
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(99, 202, 255, 0.35)");
          gradient.addColorStop(1, "rgba(99, 202, 255, 0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(99, 202, 255, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
      {
        label: "Visitors",
        data: sessionValues,
        borderColor: "rgba(167, 139, 250, 1)",
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;
          if (!chartArea) return "rgba(167, 139, 250, 0.1)";
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(167, 139, 250, 0.3)");
          gradient.addColorStop(1, "rgba(167, 139, 250, 0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(167, 139, 250, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 7,
          padding: 20,
          color: "rgba(156, 163, 175, 1)",
          font: { size: 12 },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderColor: "rgba(99, 202, 255, 0.25)",
        borderWidth: 1,
        padding: 12,
        titleColor: "rgba(209, 213, 219, 1)",
        bodyColor: "rgba(156, 163, 175, 1)",
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
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "rgba(107, 114, 128, 1)",
          font: { size: 11 },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: "rgba(107, 114, 128, 1)",
          font: { size: 11 },
          maxTicksLimit: 6,
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Traffic Trends</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("30days")}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
              filter === "30days"
                ? "bg-muted text-muted-foreground"
                : "bg-transparent text-muted-foreground/50 hover:bg-muted/30 hover:text-muted-foreground/80"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
              filter === "all"
                ? "bg-muted text-muted-foreground"
                : "bg-transparent text-muted-foreground/50 hover:bg-muted/30 hover:text-muted-foreground/80"
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      <div className="h-[300px] w-full md:h-[340px]">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrafficTrendsChart;
