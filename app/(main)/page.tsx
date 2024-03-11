import { MainPosts } from "@/components/main-posts";
import { ProfileIndicator } from "@/components/profile-indicator";
import { SuggestedAccounts } from "@/components/suggested-accounts";
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
        in: ids,
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

  const suggestedUsers = await db.user.findMany({
    where: {
      clerkId: {
        notIn: [...blockedIds!, user?.id!],
      },
      NOT: {
        clerkId: user?.id,
      },
    },
    orderBy: {
      followers: {
        _count: "desc",
      },
    },
    take: 7,
    select: {
      username: true,
      imageUrl: true,
      clerkId: true,
      firstName: true,
    },
  });

  const suggestedUsersWithFollowingStatus = suggestedUsers.map(
    (suggestedUser) => {
      const isFollowing = currUserRelatives?.following.some(
        (following) => following.followingId === suggestedUser.clerkId
      );

      return {
        ...suggestedUser,
        isFollowing,
      };
    }
  );

  const shuffledPosts = shuffleArray(posts);

  if (followingIds?.length === 0) {
    return (
      <div className="flex justify-center items-center h-full max-w-xl md:max-w-lg pb-24 mx-auto p-3">
        <SuggestedAccounts suggestedUsers={suggestedUsersWithFollowingStatus} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <MainPosts stories={stories} posts={shuffledPosts} />
        <ProfileIndicator
          suggestedUsers={suggestedUsersWithFollowingStatus.filter(
            (user) => !user.isFollowing
          )}
        />
      </div>
    </div>
  );
}
