import { ProfilePicture } from "@/components/profile-picture";
import { ProfileInfo } from "./_components/profile-info";
import { MobileFollowerCount } from "./_components/mobile-follower-count";
import { db } from "@/lib/db";
import { ProfileNavbar } from "../_components/profile-navbar";
import { ProfileFilters } from "./_components/profile-filters";
import NotFound from "@/app/not-found";
import { currentUser } from "@clerk/nextjs";
import { getBlockedUserIds } from "@/lib/blocked-users";

const ProfilePage = async ({ params }: { params: { userId: string } }) => {
  const currUser = await currentUser();
  const { userId } = params;
  const blockedIds = await getBlockedUserIds();

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const isUserBlocked = await db.blockedUser.findFirst({
    where: {
      blockedUserId: userId,
      userId: currUser?.id,
    },
  });

  const doesUserBlocked = await db.blockedUser.findFirst({
    where: {
      blockedUserId: currUser?.id,
      userId: userId,
    },
  });

  const posts = await db.post.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
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

  const likes = await db.like.findMany({
    where: {
      userId: currUser?.id,
    },
  });

  const savedPostsId = await db.savedPosts.findMany({
    where: {
      savedUserId: currUser?.id,
    },
    select: {
      postId: true,
    },
  });

  const postIds = savedPostsId.map((sp) => sp.postId);

  const savedPosts = await db.post.findMany({
    where: {
      id: {
        in: postIds,
      },
      NOT: {
        userId: {
          in: blockedIds,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
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

  const restrictedUsers = await db.restrict.findMany({
    where: {
      userId,
    },
  });

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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const postCount = await db.post.count({
    where: {
      userId,
    },
  });

  const followerCount = await db.follow.count({
    where: {
      followingId: userId,
    },
  });

  const followingCount = await db.follow.count({
    where: {
      followerId: userId,
    },
  });

  const followers = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      followers: {
        select: {
          followerId: true,
          followingId: true,
        },
      },
    },
  });

  console.log(restrictedUsers);

  const followerIds = followers?.followers.map((user) => user.followerId)!;

  const isFollowing = followerIds.includes(currUser!.id);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[40rem]">
        <NotFound />
      </div>
    );
  }

  if (isUserBlocked || doesUserBlocked) {
    return (
      <div className="flex justify-center items-center h-[40rem]">
        <NotFound />
      </div>
    );
  }

  return (
    <div className="md:pl-10 xl:pr-0">
      <ProfileNavbar username={user?.username} profileId={user?.clerkId} />
      <div className="md:w-[73%] xl:pr-44 md:pt-7 p-4 md:mx-auto  md:justify-center flex gap-5 md:gap-24 md:border-b-[1px] md:pb-12 pb-5 max-w-4xl">
        <div className="md:pl-7">
          <ProfilePicture
            onClick
            imageUrl={user?.imageUrl}
            className="md:w-36 md:h-36 w-[4.6rem] h-[4.6rem]"
          />
        </div>
        <div>
          <ProfileInfo
            isFollowing={isFollowing}
            followerCountNumber={followerCount}
            followingCountNumber={followingCount}
            postCount={postCount}
            userId={userId}
            username={user?.username}
            firstName={user?.firstName}
          />
        </div>
      </div>
      <div className="pl-5 font-semibold border-b-[1px] md:border-b-[0px] md:pb-0 pb-5 block md:hidden">
        {user?.firstName}
      </div>
      <div className="flex md:hidden justify-around w-full p-3 border-b-[1px]">
        <MobileFollowerCount
          postCount={postCount}
          followerCountNumber={followerCount}
          followingCountNumber={followingCount}
        />
      </div>
      <ProfileFilters
        comments={comments}
        likes={likes}
        posts={posts}
        profileId={userId}
        savedPosts={savedPosts}
        savedPostsId={savedPostsId}
        restrictedUsers={restrictedUsers}
      />
    </div>
  );
};

export default ProfilePage;
