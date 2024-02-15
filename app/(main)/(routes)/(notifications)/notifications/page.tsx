import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
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
    include: {
      user: {
        select: {
          imageUrl: true,
          username: true,
        },
      },
      post: {
        select: {
            imageUrl: true
        }
      }
    },
  });

  return (
    <>
      <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem]">
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
      <div className="flex flex-col max-w-xl md:max-w-lg md:pt-0 pt-9 mx-auto p-3">
        <div className="md:block hidden pt-3">
          <h1 className="font-bold">Notifications</h1>
        </div>
        <Notification notifications={notifications} />
      </div>
    </>
  );
};

export default NotificationPage;
