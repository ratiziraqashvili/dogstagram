"use client";

import { ProfilePicture } from "@/components/profile-picture";
import { generateNotificationMessage } from "@/lib/generate-notification-message";
import { formatTimeDifference } from "@/lib/timeUtils";
import { NotificationArray } from "@/types";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

interface NotificationProps {
  notifications: NotificationArray;
}

export const Notification = ({ notifications }: NotificationProps) => {
  return (
    <div className="pt-3 flex flex-col gap-1">
      {notifications.map((notification, i) => {
        const formattedTime = formatTimeDifference(notification.createdAt);
        const router = useRouter();
        return (
          <div
            onClick={
              notification.postId
                ? () => router.push(`/post/${notification.postId}`)
                : () => {}
            }
            className="flex hover:bg-primary/5 p-3 cursor-pointer"
            key={i}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <ProfilePicture
                  className="w-10 h-10"
                  imageUrl={notification.user.imageUrl}
                />
                <span className="font-semibold text-sm">
                  {notification.user.username}
                </span>
                <span className="text-sm">{generateNotificationMessage(notification.type)}</span>
                <span className="text-sm text-muted-foreground">
                  {formattedTime}
                </span>
              </div>
              <div>
                {notification.post?.imageUrl && (
                  <CldImage
                    src={notification.post?.imageUrl!}
                    alt="Post Photo"
                    width="900"
                    height="900"
                    crop="fill"
                    sharpen={60}
                    priority
                    className="w-10 h-10"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
