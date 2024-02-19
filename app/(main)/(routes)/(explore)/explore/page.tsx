import { db } from "@/lib/db";
import { ExplorePosts } from "./_components/explore-posts";
import { shuffleArray } from "@/lib/shuffleArray";
import { currentUser } from "@clerk/nextjs";
import { getBlockedUserIds } from "@/lib/blocked-users";

const ExplorePage = async () => {
  const user = await currentUser();

  const blockedIds = await getBlockedUserIds();

  const posts = await db.post.findMany({
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
    where: {
      NOT: {
        userId: {
          in: blockedIds,
        },
      },
    },
  });

  const comments = await db.comment.findMany({
    include: {
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
  });

  const likes = await db.like.findMany({
    where: {
      userId: user?.id,
    },
  });

  const savedPostsId = await db.savedPosts.findMany({
    where: {
      savedUserId: user?.id,
    },
    select: {
      postId: true,
    },
  });

  const shuffledPosts = shuffleArray(posts);

  const postUserId = shuffledPosts.map((post) => post.userId);

  const restrictedUsers = await db.restrict.findMany({
    where: {
      userId: {
        in: postUserId,
      },
    },
  });

  return (
    <div className="md:w-[73%] max-w-4xl mt-2 lg:pl-24 mx-auto pt-16 md:pt-0">
      <ExplorePosts
        restrictedUsers={restrictedUsers}
        savedPostsId={savedPostsId}
        likes={likes}
        comments={comments}
        posts={shuffledPosts}
      />
    </div>
  );
};

export default ExplorePage;
