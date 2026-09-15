"use client";

import Link from "next/link";
import { FiPlay as ViewIcon } from "react-icons/fi";
import Image from "@/common/components/elements/Image";
import { VideoItem } from "@/common/types/tiktok";

const formatViewCount = (count: number) => {
  if (count < 10000) {
    return count.toString();
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  })
    .format(count)
    .toLowerCase();
};

export default function VideoCard({
  id,
  cover,
  title,
  playCount,
}: VideoItem) {
  return (
    <Link
      href={`https://www.tiktok.com/@khensint/video/${id}`}
      target="_blank"
      className="group relative block w-full overflow-hidden rounded-lg border border-border bg-secondary transition-all duration-300 hover:border-primary/50"
    >
      <Image
        src={cover}
        className="aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
        alt={title || "TikTok Thumbnail"}
        loading="lazy"
        width={1080}
        height={1920}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute bottom-2 left-2 flex items-center gap-1 font-medium text-white">
        <ViewIcon size={16} />
        <span className="text-sm font-semibold">
          {formatViewCount(playCount || 0)}
        </span>
      </div>
    </Link>
  );
}
