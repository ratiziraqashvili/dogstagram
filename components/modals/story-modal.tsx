import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { X } from "lucide-react";
import { Progress } from "../ui/progress";
import { ProfilePicture } from "../profile-picture";
import { StoryType } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { CldImage } from "next-cloudinary";
import { useEffect, useState } from "react";

export const StoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progressValues, setProgressValues] = useState(
    Array(data?.length || 0).fill(0) // Initialize progress for all stories
  );

  const story: StoryType = data;

  const isModalOpen = isOpen && type === "story";

  const handleClose = () => {
    onClose();
  };

  const getFormattedTime = (createdAt: Date) => {
    return formatTimeDifference(createdAt);
  };

  useEffect(() => {
    if (!isModalOpen || !story) return;

    setProgressValues(Array(story.length).fill(0));

    setCurrentStoryIndex(0);
  }, [isModalOpen, story]);

  useEffect(() => {
    if (!story || !progressValues.length) return;

    const totalSeconds = 5;
    const increment = 100 / (totalSeconds * 10);

    let intervalId: NodeJS.Timeout;

    const updateProgress = () => {
      const newProgressValues = progressValues.slice();
      newProgressValues[currentStoryIndex] = Math.min(
        newProgressValues[currentStoryIndex] + increment,
        100
      );
      setProgressValues(newProgressValues);
    };

    intervalId = setInterval(updateProgress, 100);

    return () => clearInterval(intervalId);
  }, [story, currentStoryIndex, progressValues]);

  useEffect(() => {
    if (!isModalOpen || !story || currentStoryIndex >= story.length - 1) return;

    const timeoutId = setTimeout(() => {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgressValues(Array(data?.length || 0).fill(0));
    }, 6070);

    return () => clearTimeout(timeoutId);
  }, [isOpen, currentStoryIndex, story]);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogOverlay className="bg-gradient-to-t from-black to-zinc-400 cursor-pointer">
          <DialogContent className="px-0 pb-0 pt-0 w-[55%] md:w-[35%] xl:w-[25%] h-[65%] md:h-[75%] xl:h-[95%] gap-0 bg-black border-none">
            <div>
              <div className="pt-5 flex gap-1 absolute z-50 px-3 w-full">
                {progressValues.map((progress, index) => (
                  <Progress key={index} value={progress} />
                ))}
              </div>
              {story?.[currentStoryIndex] && (
                <>
                  <div className="flex absolute top-6 items-center px-3 pt-2 z-50">
                    <div className="flex items-center gap-2">
                      <ProfilePicture
                        className="w-8 h-8"
                        imageUrl={story[currentStoryIndex].user.imageUrl}
                      />
                      <span className="text-sm text-white">
                        {story[currentStoryIndex].user.username}
                      </span>
                      <span className="text-sm text-zinc-300">
                        {getFormattedTime(story[currentStoryIndex].createdAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <CldImage
                      src={story[currentStoryIndex].imageUrl}
                      alt="Story Photo"
                      crop="fill"
                      sharpen={60}
                      priority
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      width="900"
                      height="900"
                    />
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      {isModalOpen && (
        <X className="text-white size-8 cursor-pointer absolute right-1 top-4 z-50" />
      )}
    </>
  );
};
