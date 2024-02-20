import { MainPosts } from "@/components/main-posts";
import { ProfileIndicator } from "@/components/profile-indicator";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

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
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
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

  console.log(posts)

  return (
    <div className="">
      <div className="flex">
        <MainPosts posts={posts} />
        <ProfileIndicator />
      </div>
    </div>
  );
}
