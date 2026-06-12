import Skeleton from "react-loading-skeleton";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Container from "@/common/components/elements/Container";

export default function Loading() {
  return (
    <Container>
      <SkeletonLoader>
        <div className="mb-8 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-full md:w-3/4" />
        </div>
      </SkeletonLoader>
    </Container>
  );
}
