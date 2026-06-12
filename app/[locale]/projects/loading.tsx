import Skeleton from "react-loading-skeleton";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Container from "@/common/components/elements/Container";
import ProjectSkeleton from "@/modules/projects/components/ProjectSkeleton";

export default function Loading() {
  return (
    <Container>
      <SkeletonLoader>
        {/* Page Heading Skeleton */}
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full md:w-3/4" />
        </div>
      </SkeletonLoader>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <ProjectSkeleton key={i} />
        ))}
      </section>
    </Container>
  );
}
