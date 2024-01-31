"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Compass, Home, PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { usePostDataStore } from "@/hooks/use-post-data-store";

export const Routes = () => {
  const { onOpen } = useModal();
  const { addUploadedData } = usePostDataStore();

  const onCreatePostModalOpen = () => {
    onOpen("createPost");
  };

  const onUpload = (result: any, widget: any) => {
    widget.close();

    addUploadedData(result);
    localStorage.setItem('uploadedData', JSON.stringify(result));

    onCreatePostModalOpen();
  };

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
    {
      label: "Create",
      href: null,
      icon: PlusIcon,
    },
  ];

  return (
    <>
      {routes.map((route, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 w-full rounded-lg transition hover:bg-primary/5 cursor-pointer duration-300"
        >
          {route.href ? (
            <Link href={route.href}>
              <div className="flex gap-4 items-center">
                <route.icon className="w-6 h-6" />
                <span className="hidden xl:block text-md">{route.label}</span>
              </div>
            </Link>
          ) : (
            <CldUploadWidget
              onUpload={onUpload}
              uploadPreset="fcbztrpi"
              options={{
                maxFiles: 1,
              }}
            >
              {({ open }) => (
                <div
                  onClick={route.label === "Search" ? () => {} : () => open?.()}
                  className="flex gap-4 items-center"
                >
                  <route.icon className="w-6 h-6" />
                  <span className="hidden xl:block text-md">{route.label}</span>
                </div>
              )}
            </CldUploadWidget>
          )}
        </div>
      ))}
    </>
  );
};
