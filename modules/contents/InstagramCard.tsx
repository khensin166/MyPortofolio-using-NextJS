"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AiFillHeart as LikeIcon } from "react-icons/ai";
import { FaComment as CommentIcon } from "react-icons/fa";
import { HiOutlineDuplicate as CarouselIcon } from "react-icons/hi";

import Image from "@/common/components/elements/Image";

interface InstagramCardProps {
  id: string;
  url: string;
  thumbnails: string[];
  likes: number;
  comments: number;
  caption: string;
}

const formatCount = (count: number) => {
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
};

export default function InstagramCard({
  url,
  thumbnails,
  likes,
  comments,
  caption,
}: InstagramCardProps) {
  const isCarousel = thumbnails.length > 1;

  return (
    <Link
      href={url}
      target="_blank"
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex w-full"
          initial={false}
          whileHover={isCarousel ? { x: "-100%" } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full flex-shrink-0">
            <Image
              src={thumbnails[0]}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              alt={caption?.substring(0, 50) || "Instagram Post"}
              loading="lazy"
              width={400}
              height={600}
            />
          </div>
          {isCarousel && (
            <div className="w-full flex-shrink-0">
              <Image
                src={thumbnails[1] || thumbnails[0]}
                className="w-full h-auto object-cover"
                alt="Next Slide"
                loading="lazy"
                width={400}
                height={600}
              />
            </div>
          )}
        </motion.div>

        {/* Carousel Indicator */}
        {isCarousel && (
          <div className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white transition-opacity group-hover:opacity-0">
            <CarouselIcon size={18} />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-center items-center gap-4 text-white z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LikeIcon size={24} className="text-white" />
              <span className="font-bold text-lg">{formatCount(likes)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CommentIcon size={20} className="text-white" />
              <span className="font-bold text-lg">{formatCount(comments)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed transition-colors duration-300">
          {caption || "No caption"}
        </p>
      </div>
    </Link>
  );
}
