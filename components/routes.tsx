import { Compass, Home, Search } from "lucide-react";
import Link from "next/link";

export const Routes = () => {
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
        <div key={route.href} className="flex items-center gap-4 p-3 w-full rounded-lg transition hover:bg-primary/5 cursor-pointer duration-300">
          {route.href ? (
            <Link href={route.href}>
              <div className="flex gap-4 items-center">
                <route.icon className="w-6 h-6" />
                <span className="hidden xl:block text-md font-[500] pt-[0.20rem]">
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
