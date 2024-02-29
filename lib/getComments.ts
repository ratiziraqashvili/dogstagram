import { db } from "./db"

export const getComments = async ({ blockedIds }: { blockedIds: string[] }) => {
    const comments = await db.comment.findMany({
        where: {
          NOT: {
            userId: {
              in: blockedIds,
            },
          },
        },
        include: {
          user: {
            select: {
              imageUrl: true,
              username: true,
            },
          },
          reply: {
            select: {
              content: true,
              replyAuthorUsername: true,
              replyAuthorId: true,
              userId: true,
              createdAt: true,
              id: true,
              user: {
                select: {
                  imageUrl: true,
                  username: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments
}