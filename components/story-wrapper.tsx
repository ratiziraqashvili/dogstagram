import { cn } from "@/lib/utils";

interface StoryWrapperProps {
  children: React.ReactNode;
  storyLength: number;
}

export const StoryWrapper = ({ children, storyLength }: StoryWrapperProps) => {
  return (
    <div
      className={cn(
        storyLength > 0 &&
          "bg-gradient-to-r from-amber-400 to-amber-600 rounded-full p-1"
      )}
    >
      {children}
    </div>
  );
};
