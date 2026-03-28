import Link from "next/link";
import { useTranslations } from "next-intl";
import { SiTiktok as TiktokIcon, SiInstagram as InstagramIcon } from "react-icons/si";

import Image from "@/common/components/elements/Image";
import { inter } from "@/common/styles/fonts";

interface ProfileHeaderProps {
  platform: "tiktok" | "instagram";
  username: string;
  fullName: string;
  profilePic: string;
  externalUrl: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
    likes: number;
    views?: number;
    comments?: number;
  };
}

function StatItem({ count, label }: { count: number; label: string }) {
  const format = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="flex flex-col items-center md:items-start min-w-[80px]">
      <span className="text-xl font-bold text-foreground transition-colors duration-300">
        {format(count)}
      </span>
      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest transition-colors duration-300">
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeader({
  platform,
  username,
  fullName,
  profilePic,
  externalUrl,
  stats,
}: ProfileHeaderProps) {
  const t = useTranslations("ContentsPage");

  const isInstagram = platform === "instagram";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm transition-colors duration-300">
      {/* Profile Picture */}
      <div className="relative flex-shrink-0 self-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-30"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/proxy-image?url=${encodeURIComponent(profilePic)}`}
          className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border-4 border-card object-cover"
          alt="Profile"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 text-center sm:text-left min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            @{username}
          </h2>
          <span className={`text-xs text-muted-foreground ${inter.className}`}>{fullName}</span>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-x-12 gap-y-3">
          <StatItem count={stats.followers} label="Followers" />
          <StatItem count={stats.following} label="Following" />
          <StatItem count={stats.likes} label="Likes" />
          <StatItem count={stats.posts} label={isInstagram ? "Posts" : "Videos"} />
          {/* {stats.views !== undefined && <StatItem count={stats.views} label="Views" />} */}
          {stats.comments !== undefined && <StatItem count={stats.comments} label="Comments" />}
        </div>
      </div>

      {/* Platform Button */}
      <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0 w-full sm:w-auto">
        <div className="p-0.5 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-lg">
          <div className="bg-card rounded-[calc(0.75rem-2px)] p-3 flex items-center justify-center w-[68px] h-[68px]">
            {isInstagram ? (
              <InstagramIcon size={40} className="text-pink-500" />
            ) : (
              <TiktokIcon size={40} className="text-dark dark:text-light" />
            )}
          </div>
        </div>

        <Link
          href={externalUrl}
          target="_blank"
          className="w-full sm:w-auto text-center px-5 py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold transition-all duration-300 shadow whitespace-nowrap"
        >
          {isInstagram ? "Open Instagram" : t("open_tiktok")}
        </Link>
        <div className="text-[10px] text-muted-foreground/80">
          {t("view")}{" "}
          <Link
            href={isInstagram ? "https://help.instagram.com/519522125107875" : "https://www.tiktok.com/legal/page/row/privacy-policy/"}
            target="_blank"
            className="underline hover:text-primary transition-colors"
          >
            {t("privacy_policy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
