"use client";

import Image from "next/image";
import { Routes } from "./routes";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import MoonLoader from "react-spinners/MoonLoader";
import { useUser } from "@clerk/nextjs";
import { MoreDropDown } from "./more-dropdown";

export const Sidebar = () => {
  const { isLoaded } = useUser();

  return (
    <div className="lg:w-[15.3rem] w-[4.6rem] border-r-[1px] h-full flex flex-col p-3 gap-7">
      <div className="pt-3 lg:block hidden">
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
      <div className="lg:hidden block mt-2 hover:bg-primary/10 transition rounded-md relative w-12 h-12">
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
          <div className="flex items-center justify-center lg:justify-normal gap-2.5 p-2.5 w-full rounded-md transition hover:bg-primary/10 cursor-pointer duration-300">
            {isLoaded ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <MoonLoader size={25} />
            )}
            <span className="hidden lg:block">Profile</span>
          </div>
        </Link>
      </div>
      <div className="hover:bg-primary/10 rounded-md transition duration-300">
        <MoreDropDown />
      </div>
    </div>
  );
};
