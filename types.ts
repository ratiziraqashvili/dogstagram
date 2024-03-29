import { Comment, Notification, Post, Story } from "@prisma/client";

export type PostInfoType = (
    Post & {
        _count: {
          likes: number;
          comments: number;
          reply: number;
        },
        user: {
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

export type StoryType = (
  Story & {
    user: {
      username: string;
      imageUrl: string | null;
    }
  }
)[]

export type SingleStory = (
  Story & {
    user: {
      username: string;
      imageUrl: string | null;
    }
  }
)

export type CommentArray = (
  Comment & {
    user: {
      username: string | null;
      imageUrl: string | null;
    };
    reply: {
      content: string;
      user: {
          username: string;
          imageUrl: string | null;
      };
      replyAuthorUsername: string;
      replyAuthorId: string;
      userId: string;
      createdAt: Date;
      id: string;
  }[];
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

export type SuggestedUsers = {
    imageUrl: string | null;
    username: string;
    clerkId: string;
    firstName: string | null;
    isFollowing: boolean | undefined;
}[];