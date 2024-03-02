import { cn } from "@/lib/utils";

interface StoryWrapperProps {
  children: React.ReactNode;
  hasStory?: boolean;
  isStory?: boolean;
}

export const StoryWrapper = ({
  children,
  hasStory,
  isStory,
}: StoryWrapperProps) => {
  return (
    <div
      className={cn(
        (hasStory || isStory) && "ring-2 ring-amber-500 rounded-full p-1"
      )}
    >
      {children}
    </div>
  );
};
