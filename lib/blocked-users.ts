import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

export async function getBlockedUserIds() {

  const user = await currentUser();

  const youBlocked = await db.blockedUser.findMany({
    where: {
      userId: user?.id,    
    }
  });

  const blockedYou = await db.blockedUser.findMany({
    where: {
      blockedUserId: user?.id,
    }
  });

  return [
    ...youBlocked.map(u => u.blockedUserId),
    ...blockedYou.map(u => u.userId), 
  ]
}