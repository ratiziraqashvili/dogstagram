import { db } from "@/lib/db";
import { ExplorePosts } from "./_components/explore-posts";
import { shuffleArray } from "@/lib/shuffleArray";
import { currentUser } from "@clerk/nextjs";

const ExplorePage = async () => {
  const user = await currentUser();

  const blockedUsers = await db.blockedUser.findMany({});

  const blockedUsersIds = blockedUsers.map((user) => user.blockedUserId);

  console.log(blockedUsers);

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
          in: blockedUsersIds,
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
