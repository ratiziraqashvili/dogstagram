import { ProfilePicture } from "@/components/profile-picture";
import { ProfileInfo } from "./_components/profile-info";
import { MobileFollowerCount } from "./_components/mobile-follower-count";
import { db } from "@/lib/db";
import { ProfileNavbar } from "../_components/profile-navbar";
import { ProfileFilters } from "./_components/profile-filters";

const ProfilePage = async ({ params }: { params: { userId: string }} ) => {
  const { userId } = params;

  const user = await db.user.findUnique({
    where: {
      clerkId: userId
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return (
    <>
      <ProfileNavbar username={user?.username} profileId={user?.clerkId} />
      <div className="md:w-[80%] xl:pr-44 md:pt-7 p-4 md:mx-auto  md:justify-center flex gap-5 md:gap-24 md:border-b-[1px] md:pb-12 pb-5">
        <div className="md:pl-7">
          <ProfilePicture imageUrl={user?.imageUrl} className="md:w-36 md:h-36 w-[4.6rem] h-[4.6rem]" />
        </div>
        <div>
          <ProfileInfo userId={userId} username={user?.username} firstName={user?.firstName} />
        </div>
      </div>
      <div className="pl-5 lowercase font-semibold border-b-[1px] md:border-b-[0px] md:pb-0 pb-5 block md:hidden">{user?.firstName}</div>
      <div className="flex md:hidden justify-around w-full p-3 border-b-[1px]">
        <MobileFollowerCount />
      </div>
        <ProfileFilters />
    </>
  );
};

export default ProfilePage;
