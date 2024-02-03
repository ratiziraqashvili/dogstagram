"use client";

import { useModal } from "@/hooks/use-modal-store";
import { Compass, Home, PlusIcon, Search } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import { useToast } from "./ui/use-toast";

export const Routes = () => {
  const { onOpen } = useModal();
  const { addUploadedData } = usePostDataStore();
  const { toast } = useToast();

  const onCreatePostModalOpen = () => {
    onOpen("createPost");
  };

  const onUpload = (result: any, widget: any) => {
    widget.close();

    // Get file type from result
    const { resource_type } = result.info;

    // Check if file is an image
    if (resource_type !== "image") {
      // Handle invalid file type
      toast({
        title: "Make sure that uploaded file is valid image.",
        variant: "default",
        duration: 3000,
      });
      return;
    }

    addUploadedData(result);

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
          className="flex items-center gap-4 p-3 w-full rounded-lg transition hover:bg-primary/5 cursor-pointer duration-300 group"
        >
          {route.href ? (
            <Link className="w-full" href={route.href}>
              <div className="flex gap-4 items-center">
                <route.icon className="w-6 h-6 group-hover:scale-105 transition" />
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
                  className="flex gap-4 items-center w-full"
                >
                  <route.icon className="w-6 h-6 group-hover:scale-105 transition" />
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
