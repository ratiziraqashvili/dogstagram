import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
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
  });

  return (
    <div className="mx-auto lg:max-w-[60%] md:max-w-[80%] max-w-full xl:ml-[20rem] md:mt-0 mt-[3.8rem] pb-20 sm:pb-0 pt-7">
      <div className="flex items-center gap-2 border-b-[1px] pb-20">
        <Link href="/">
          <ArrowLeft className="text-lg cursor-pointer" />
        </Link>
        <h1 className="text-xl">Archive</h1>
      </div>
        <StoriesDisplay expiredStories={expiredStories} />
    </div>
  );
};

export default ArchivePage;
