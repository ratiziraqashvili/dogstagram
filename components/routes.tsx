"use client";

import { cn } from "@/lib/utils";
import { Compass, Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Routes = () => {
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Search",
      href: null,
      icon: Search,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
    },
  ];

  return (
    <>
      {routes.map((route) => (
        <div
          className={cn(
            "flex items-center gap-4 p-3 w-full rounded-lg transition hover:bg-primary/10 cursor-pointer duration-300",
            pathname === route.href && "bg-primary/10"
          )}
        >
          {route.href ? (
            <Link href={route.href}>
              <div className="flex gap-4 items-center">
                <route.icon className="w-6 h-6" />
                <span
                  className={cn(
                    "hidden xl:block text-md font-[500] pt-[0.20rem]",
                    pathname === route.href && "font-bold"
                  )}
                >
                  {route.label}
                </span>
              </div>
            </Link>
          ) : (
            <>
              <route.icon className="w-6 h-6" />
              <span className="hidden xl:block text-md font-[500] pt-[0.20rem]">
                {route.label}
              </span>
            </>
          )}
        </div>
      ))}
    </>
  );
};
