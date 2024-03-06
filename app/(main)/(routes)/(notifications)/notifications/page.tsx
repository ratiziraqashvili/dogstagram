import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { ChevronLeft, MessageCircleHeart } from "lucide-react";
import Link from "next/link";
import { Notification } from "./_components/notification";

const NotificationPage = async () => {
  const user = await currentUser();

  const notifications = await db.notification.findMany({
    where: {
      recipient: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      user: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
      post: {
        select: {
          imageUrl: true,
        },
      },
    },
  });

  const unreadNotis = await db.notification.findMany({
    where: {
      recipient: user?.id,
      isRead: false,
    },
    select: {
      id: true,
    },
  });

  const unReadNotiIds = unreadNotis.map((noti) => noti.id);

  await db.notification.updateMany({
    where: {
      id: {
        in: unReadNotiIds,
      },
    },
    data: {
      isRead: true,
    },
  });

  if (notifications.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem] fixed w-full">
          <div className="pl-1">
            <Link href="/">
              <ChevronLeft />
            </Link>
          </div>
          <div className="">
            <p className="font-semibold">Notifications</p>
          </div>
          {/* added empty div to push notification in center */}
          <div className="w-[2.9rem]" />
        </div>
        <div className="flex justify-center flex-col gap-5 items-center h-full md:pl-20">
          <MessageCircleHeart
            strokeWidth="0.8px"
            className="text-[#343434] size-20"
          />
          <p className="text-sm">Activity On Your Posts</p>
          <p className="text-sm text-center">
            When someone likes or comments on one of your posts, you&apos;ll see it
            here.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem] fixed w-full">
        <div className="pl-1">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </div>
        <div className="">
          <p className="font-semibold">Notifications</p>
        </div>
        {/* added empty div to push notification in center */}
        <div className="w-[2.9rem]" />
      </div>
      <div className="flex flex-col max-w-xl md:max-w-lg md:pt-6 mx-auto p-3">
        <div className="md:block hidden pt-3">
          <h1 className="font-bold">Notifications</h1>
        </div>
        <Notification notifications={notifications} />
      </div>
    </>
  );
};

export default NotificationPage;
