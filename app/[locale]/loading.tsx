import Skeleton from "react-loading-skeleton";
import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Breakline from "@/common/components/elements/Breakline";
import Container from "@/common/components/elements/Container";

export default function Loading() {
  return (
    <Container>
      <SkeletonLoader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="h-10 w-3/4 md:w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
          <div className="hidden md:block w-48 h-48 ml-auto">
            <Skeleton circle className="w-full h-full" />
          </div>
        </div>

        <Breakline className="my-8" />

        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl mt-4" />
        </div>

        <Breakline className="my-8" />

        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </SkeletonLoader>
    </Container>
  );
}
