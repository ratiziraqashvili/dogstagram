import { Post } from "@prisma/client";

export type PostInfoType = (
    Post & {
        _count: {
          likes: number;
          comments: number;
        },
        user: {
          imageUrl: string | null;
          username: string | null;
          firstName: string | null;
        }
      }
)[]