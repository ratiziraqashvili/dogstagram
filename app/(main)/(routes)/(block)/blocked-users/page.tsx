import { currentUser } from "@clerk/nextjs";
import { BlockList } from "./_components/block-list";
import { db } from "@/lib/db";

const BlockedUsers = async () => {
  const user = await currentUser();

  const blockedProfiles = await db.blockedUser.findMany({
    where: {
      userId: user?.id,
    },
  });

  const blockIds = blockedProfiles.map((id) => id.blockedUserId);

  const blockedUser = await db.user.findMany({
    where: {
      clerkId: {
        in: blockIds,
      },
    },
  });

  return (
    <div className="flex justify-center max-w-4xl mx-auto">
      <BlockList blockedUser={blockedUser} />
    </div>
  );
};

export default BlockedUsers;
