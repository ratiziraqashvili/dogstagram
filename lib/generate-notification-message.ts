import { NotificationType } from "@prisma/client";

//TODO: add noti for replies

export const generateNotificationMessage = (type: NotificationType) => {
    switch (type) {
        case NotificationType.COMMENT:
            return "commented on your post.";
        case NotificationType.FOLLOW:
            return "started following you.";
        case NotificationType.FAVORITE:
            return "favorited your post.";
        case NotificationType.LIKE:
            return "liked your post."       
    }
}