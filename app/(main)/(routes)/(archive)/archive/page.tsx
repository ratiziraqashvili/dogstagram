import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { StoriesDisplay } from "./_components/stories-display";

const ArchivePage = async () => {
  const user = await currentUser();
  const now = new Date();

  const expiredStories = await db.story.findMany({
    where: {
      userId: user?.id,
      expiresAt: {
        lte: now,
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

  console.log(expiredStories)

  return (
    <div className="mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] pb-20 sm:pb-0 md:pt-7">
      <div className="md:flex hidden items-center gap-2 border-b-[1px] pb-20">
        <Link href="/">
          <ArrowLeft className="text-lg cursor-pointer" />
        </Link>
        <h1 className="text-xl">Archive</h1>
      </div>
      <div className="flex items-center justify-between md:hidden border-b-[1px] h-[2.8rem] fixed w-full bg-white z-50">
        <div className="pl-1">
          <Link href="/">
            <ChevronLeft />
          </Link>
        </div>
        <div className="">
          <p className="font-semibold">Archive</p>
        </div>
        {/* added empty div to push notification in center */}
        <div className="w-[2.9rem]" />
      </div>
      <StoriesDisplay expiredStories={expiredStories} />
    </div>
  );
};

export default ArchivePage;
