import { MainPosts } from "@/components/main-posts";
import { ProfileIndicator } from "@/components/profile-indicator";
import { getBlockedUserIds } from "@/lib/blocked-users";
import { db } from "@/lib/db";
import { shuffleArray } from "@/lib/shuffleArray";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  const blockedIds = await getBlockedUserIds();
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const currUserRelatives = await db.user.findFirst({
    where: {
      clerkId: user?.id,
    },
    select: {
      following: true,
      followers: true,
    },
  });

  const followingIds = currUserRelatives?.following.map(
    (user) => user.followingId
  );
  const followerIds = currUserRelatives?.followers.map(
    (user) => user.followerId
  );

  const ids = [...(followingIds ?? []), ...(followerIds ?? [])];

  const posts = await db.post.findMany({
    where: {
      userId: {
        in: ids,
      },
      createdAt: {
        gte: twoWeeksAgo,
      },
      NOT: {
        userId: {
          in: blockedIds,
        },
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
          reply: true,
        },
      },
      user: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
    },
  });

  const now = new Date();

  const stories = await db.story.findMany({
    where: {
      userId: {
        in: followingIds,
      },
      expiresAt: {
        gte: now,
      },
      NOT: {
        userId: {
          in: blockedIds,
        },
      },
    },
    include: {
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
    },
  });

  const shuffledPosts = shuffleArray(posts);

  return (
    <div>
      <div className="flex">
        <MainPosts stories={stories} posts={shuffledPosts} />
        <ProfileIndicator />
      </div>
    </div>
  );
}
