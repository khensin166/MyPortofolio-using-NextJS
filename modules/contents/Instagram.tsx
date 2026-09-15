"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";

import InstagramList from "./InstagramList";
import InstagramHighlights from "./InstagramHighlights";
import ProfileHeader from "./ProfileHeader";
import { ProfileHeaderSkeleton, VideoListSkeleton } from "./TiktokSkeleton";

import EmptyState from "@/common/components/elements/EmptyState";
import { getInstagramData } from "@/services/portfolio";

const Instagram = () => {
  const t = useTranslations("ContentsPage");

  const { data, isLoading, error } = useSWR(
    "creations/instagram",
    getInstagramData
  );

  if (isLoading) {
    return (
      <section className="space-y-8">
        <ProfileHeaderSkeleton />
        <VideoListSkeleton />
      </section>
    );
  }

  if (error || !data) return <EmptyState message={t("error")} />;

  const { profile, posts } = data;

  return (
    <section className="space-y-8">
      <ProfileHeader
        platform="instagram"
        username={profile.username}
        fullName={profile.fullName}
        profilePic={profile.profilePic}
        externalUrl={`https://www.instagram.com/${profile.username}`}
        stats={{
          followers: profile.stats.followers,
          following: profile.stats.following,
          posts: profile.stats.postsCount,
          likes: profile.stats.totalLikes,
          views: profile.stats.totalViews,
          comments: profile.stats.totalComments,
        }}
      />

      {data?.highlights && data.highlights.length > 0 && (
        <InstagramHighlights highlights={data.highlights} />
      )}

      {posts.length > 0 ? (
        <>
          <div className="flex items-center gap-4 mt-8 mb-6">
            <div className="h-[1px] flex-1 bg-border transition-colors duration-300"></div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] transition-colors duration-300">
              {posts.length} Posts
            </h3>
            <div className="h-[1px] flex-1 bg-border transition-colors duration-300"></div>
          </div>
          <InstagramList posts={posts} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed rounded-lg mt-8">
          <p className="text-sm font-medium">No posts available at the moment</p>
          <p className="text-xs mt-1 opacity-70">Check back later or visit my Instagram profile directly.</p>
        </div>
      )}
    </section>
  );
};

export default Instagram;
