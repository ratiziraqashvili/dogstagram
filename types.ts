import { Comment, Notification, Post } from "@prisma/client";

export type PostInfoType = (
    Post & {
        _count: {
          likes: number;
          comments: number;
        },
        user?: {
          imageUrl: string | null;
          username: string | null;
        }
      }
)[]

export type SinglePost = (
  Post & {
    _count: {
      likes: number;
      comments: number;
    };
    user: {
      imageUrl: string | null;
      username: string | null;
    };
  }
)

export type CommentArray = (
  Comment & {
    user: {
      username: string | null;
      imageUrl: string | null;
    }
  }
)[] | undefined;

export type NotificationArray = (
  Notification & {
    user: {
      username: string;
      imageUrl: string | null;
    },
    post: {
      imageUrl: string,
    } | null
    postId: string | null,
  }
)[];

export type SearchUser = {
  clerkId: string;
  firstName: string;
  imageUrl: string;
  username: string;
}[];