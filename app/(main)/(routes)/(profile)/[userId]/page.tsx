import { ProfilePicture } from "@/components/profile-picture";
import { ProfileInfo } from "./_components/profile-info";

const ProfilePage = () => {
  return (
    <div className="xl:w-[80%] w-full xl:pr-44 pt-7 p-4 md:mx-auto  justify-center flex gap-24">
      <div className="">
        <ProfilePicture className="w-36 h-36" />
      </div>
      <div>
        <ProfileInfo />
      </div>
    </div>
  );
};

export default ProfilePage;
