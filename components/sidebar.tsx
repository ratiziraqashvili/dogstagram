import Image from "next/image";
import { Routes } from "./routes";
import Link from "next/link";
import { MoreDropDown } from "./more-dropdown";
import { ProfilePicture } from "./profile-picture";

export const Sidebar = () => {
  return (
    <div className="xl:w-[15.3rem] w-[4.6rem] border-r-[1px] h-full flex flex-col p-3 gap-7 fixed">
      <div className="pt-3 xl:block hidden">
        <Link href="/">
          <Image
            alt="Dogstagram"
            src="/logo.png"
            width={130}
            height={130}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="xl:hidden block mt-2 hover:bg-primary/10 transition rounded-md relative w-12 h-12">
        <Link href="/">
          <Image
            className="hover:scale-110 transition cursor-pointer"
            alt="Dogstagram"
            src="/main-logo.png"
            fill
          />
        </Link>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <Routes />
        <Link href="/profile">
          <div className="flex items-center justify-center xl:justify-normal gap-[1rem] p-3 w-full rounded-md transition hover:bg-primary/10 cursor-pointer duration-300 pl-[0.770rem]">
            <ProfilePicture />
            <span className="hidden xl:block pt-0.5">Profile</span>
          </div>
        </Link>
      </div>
      <div className="hover:bg-primary/10 rounded-md transition duration-300">
        <MoreDropDown />
      </div>
    </div>
  );
};
