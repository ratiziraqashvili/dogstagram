import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { X } from "lucide-react";
import { Progress } from "../ui/progress";
import { ProfilePicture } from "../profile-picture";
import { StoryType } from "@/types";
import { formatTimeDifference } from "@/lib/timeUtils";
import { CldImage } from "next-cloudinary";

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
              <div className="pt-5 flex gap-1 absolute z-50 px-3 w-full">
                {[...Array(story?.length)].map((_, i) => (
                  <Progress key={i} value={0} />
                ))}
              </div>
              {story?.map((s) => (
                <>
                  <div className="flex absolute top-6 items-center px-3 pt-2 z-50">
                    <div className="flex items-center gap-2">
                      <ProfilePicture
                        className="w-8 h-8"
                        imageUrl={s.user.imageUrl}
                      />
                      <span className="text-sm text-white">
                        {s.user.username}
                      </span>
                      <span className="text-sm text-zinc-300">
                        {getFormattedTime(s.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <CldImage
                      src={s.imageUrl}
                      alt="Story Photo"
                      crop="fill"
                      sharpen={60}
                      priority
                      className="absolute inset-0 w-full h-full object-cover"
                      width="900"
                      height="900"
                    />
                  </div>
                </>
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
