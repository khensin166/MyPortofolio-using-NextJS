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

        {/* Contact List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>

        <Breakline className="my-6" />

        {/* Contact Form Skeleton */}
        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg mt-4" />
        </div>
      </SkeletonLoader>
    </Container>
  );
}
