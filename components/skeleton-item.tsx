import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const SkeletonItem = ({
  firstSkeleton = "h-4 w-[120px]",
  secondSkeleton = "h-4 w-[90px]",
  className,
}: {
  firstSkeleton?: string;
  secondSkeleton?: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className={firstSkeleton} />
        <Skeleton className={secondSkeleton} />
      </div>
    </div>
  );
};

export default SkeletonItem;
