"use client";

import { SingleStory, StoryType } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { StoryWrapper } from "./story-wrapper";
import { useModal } from "@/hooks/use-modal-store";

interface StoriesProps {
  stories: StoryType;
}

export const Stories = ({ stories }: StoriesProps) => {
  const { onOpen } = useModal();

  const onStoryModalOpen = (userId: string) => {
    const userStories = stories.filter((s) => s.userId === userId);
    onOpen("story", userStories);
  };

  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.userId;
    if (!acc[userId]) {
      acc[userId] = story;
    }
    return acc;
  }, {} as Record<string, SingleStory>);

  // get unique users from grouped stories
  const uniqueUsers = Object.values(groupedStories);

  return (
    <div className="pt-5 flex gap-2 md:gap-3 px-3 md:px-10">
      {uniqueUsers.map((story) => (
        <div
          className="flex items-center flex-col gap-1 cursor-pointer"
          key={story.id}
          onClick={() => onStoryModalOpen(story.userId)}
        >
          <StoryWrapper isStory>
            <ProfilePicture
              className="w-14 h-14"
              imageUrl={story.user.imageUrl}
            />
          </StoryWrapper>
          <span className="text-muted-foreground text-xs truncate w-[80%] text-center">
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};
