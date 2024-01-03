import { Compass, Home, Plus } from "lucide-react";
import { ProfilePicture } from "./profile-picture";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";

export const MobileBottomNavbar = async () => {
    const user = await currentUser();

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
        {routes.map((route) => (
          <div className="p-3 hover:scale-110 transition w-full flex justify-center"
          >
            {route.href ? (
              <Link href={route.href}>
                <route.icon  />
              </Link>
            ) : (
              <route.icon />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
