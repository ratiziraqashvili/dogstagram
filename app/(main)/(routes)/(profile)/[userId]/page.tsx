import { ProfilePicture } from "@/components/profile-picture";
import { ProfileInfo } from "./_components/profile-info";
import { clerkClient } from "@clerk/nextjs";
import { MobileFollowerCount } from "./_components/mobile-follower-count";

const ProfilePage = async ({ params }: { params: { userId: string }} ) => {
  const { userId } = params;

  const { imageUrl, username, firstName } = await clerkClient.users.getUser(userId);

  return (
    <>
      <div className="md:w-[80%] xl:pr-44 md:pt-7 p-4 md:mx-auto  md:justify-center flex gap-5 md:gap-24 md:border-b-[1px] md:pb-12 pb-5">
        <div className="md:pl-7">
          <ProfilePicture imageUrl={imageUrl} className="md:w-36 md:h-36 w-[4.6rem] h-[4.6rem]" />
        </div>
        <div>
          <ProfileInfo username={username} firstName={firstName} />
        </div>
      </div>
      <div className="pl-5 lowercase font-semibold border-b-[1px] md:border-b-[0px] md:pb-0 pb-5 block md:hidden">{firstName}</div>
      <div className="flex md:hidden justify-around w-full p-3 border-b-[1px]">
        <MobileFollowerCount />
      </div>
    </>
  );
};

export default ProfilePage;
