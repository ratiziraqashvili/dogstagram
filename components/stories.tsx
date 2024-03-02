import { StoryType } from "@/types";
import { ProfilePicture } from "./profile-picture";
import { StoryWrapper } from "./story-wrapper";

interface StoriesProps {
  stories: StoryType;
}

export const Stories = ({ stories }: StoriesProps) => {
  return (
    <div className="pt-3 flex gap-3">
      {stories.map((story) => (
        <div
          className="flex items-center flex-col gap-1 cursor-pointer"
          key={story.id}
        >
          <StoryWrapper isStory>
            <ProfilePicture
              className="w-14 h-14"
              imageUrl={story.user.imageUrl}
            />
          </StoryWrapper>
          <span className="text-muted-foreground text-xs truncate w-[80%]">
            {story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
};
