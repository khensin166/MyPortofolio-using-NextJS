import Skeleton from "react-loading-skeleton";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Breakline from "@/common/components/elements/Breakline";
import Container from "@/common/components/elements/Container";

export default function Loading() {
  return (
    <Container>
      <SkeletonLoader>
        {/* Page Heading Skeleton */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full md:w-3/4" />
        </div>

        {/* Story (About Me) Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full" count={4} />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <Breakline className="my-8" />

        {/* CareerList (Experience) Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton circle className="w-6 h-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <div className="mt-4">
                  <Skeleton className="h-4 w-full" count={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Breakline className="my-8" />

        {/* EducationList Skeleton */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton circle className="w-6 h-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </SkeletonLoader>
    </Container>
  );
}
