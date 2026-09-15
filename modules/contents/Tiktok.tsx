"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";

import VideoList from "./VideoList";
import ProfileHeader from "./ProfileHeader";
import { ProfileHeaderSkeleton, VideoListSkeleton } from "./TiktokSkeleton";

import EmptyState from "@/common/components/elements/EmptyState";
import { getTiktokData } from "@/services/portfolio";

const Tiktok = () => {
  const t = useTranslations("ContentsPage");

  const { data, isLoading, error } = useSWR(
    "creations/tiktok",
    getTiktokData,
  );

  if (isLoading) {
    return (
      <section className="space-y-6">
        <ProfileHeaderSkeleton />
        <VideoListSkeleton />
      </section>
    );
  }

  if (error || !data) return <EmptyState message={t("error")} />;

  const { profile, videos } = data;

  return (
    <section className="space-y-4">
      {profile && (
        <ProfileHeader
          platform="tiktok"
          username={profile.username}
          fullName={profile.nickname}
          profilePic={profile.avatar}
          externalUrl={`https://www.tiktok.com/@${profile.username}`}
          stats={{
            followers: profile.stats.followers,
            following: profile.stats.following,
            likes: profile.stats.likes,
            posts: profile.stats.videos,
          }}
        />
      )}

      {videos && videos.length > 0 ? (
        <VideoList videos={videos} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-lg mt-8">
          <p className="text-sm font-medium">No videos available at the moment</p>
          <p className="text-xs mt-1 opacity-70">Check back later or visit my TikTok profile directly.</p>
        </div>
      )}
    </section>
  );
};

export default Tiktok;
