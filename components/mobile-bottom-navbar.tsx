"use client";

import { Compass, Home, Plus } from "lucide-react";
import { ProfilePicture } from "./profile-picture";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";

export const MobileBottomNavbar = () => {
  const { user } = useClerk();

  const routes = [
    {
      icon: Home,
      href: "/",
    },
    {
      icon: Compass,
      href: "/explore",
    },
    {
      icon: Plus,
      href: null,
    },
    {
      icon: ProfilePicture,
      href: `/${user?.id}`,
    },
  ];

  return (
    <div className="border-t-[1px] w-full flex justify-center  fixed bottom-0">
      <div className="flex justify-between items-center w-[100%] ">
        {routes.map((route, index) => (
          <div
            key={index}
            className="p-3 hover:scale-110 transition w-full flex justify-center"
          >
            {route.href ? (
              <Link href={route.href}>
                <route.icon />
              </Link>
            ) : (
              <CldUploadWidget
                uploadPreset="fcbztrpi"
                options={{
                  maxFiles: 6,
                }}
              >
                {/*@ts-ignore*/}
                {({ open }) => <route.icon onClick={() => open?.()} />}
              </CldUploadWidget>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
