import { db } from "@/lib/db";
import { ExplorePosts } from "./_components/explore-posts";
import { shuffleArray } from "@/lib/shuffleArray";

const ExplorePage = async () => {
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
  });

  const shuffledPosts = shuffleArray(posts);

  return (
    <div className="h-full flex justify-center md:pl-24 pt-5">
      <ExplorePosts posts={shuffledPosts} />
    </div>
  );
};

export default ExplorePage;
