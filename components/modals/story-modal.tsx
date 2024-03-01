import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { MoreVertical, X } from "lucide-react";
import { Progress } from "../ui/progress";
import { ProfilePicture } from "../profile-picture";
import { StoryType } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";

export const StoryModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const story: StoryType = data;

  const isModalOpen = isOpen && type === "story";

  const handleClose = () => {
    onClose();
  };

  const getFormattedTime = (createdAt: Date) => {
    return formatTimeDifference(createdAt);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogOverlay className="bg-gradient-to-t from-black to-zinc-400 cursor-pointer">
          <DialogContent className="px-0 pb-0 pt-0 w-[55%] md:w-[35%] xl:w-[25%] h-[65%] md:h-[75%] xl:h-[95%] gap-0 bg-black border-none">
            <div>
              <div className="pt-5 px-3">
                {[...Array(story?.length)].map((_, i) => (
                  <Progress key={i} value={30} />
                ))}
              </div>
              {story?.map((s) => (
                <div className="flex items-center justify-between">
                  <div>
                    <ProfilePicture imageUrl={s.user.imageUrl} />
                    <span className="text-sm">{s.user.username}</span>
                    <span>{getFormattedTime(s.)}</span>
                  </div>
                  <div>
                    <MoreVertical className="size-5 text-white cursor-pointer" />
                  </div>
                </div>
              ))}
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
