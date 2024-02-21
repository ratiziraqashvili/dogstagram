"use client";

import { Compass, Home, Plus } from "lucide-react";
import { ProfilePicture } from "./profile-picture";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { CldUploadWidget } from "next-cloudinary";
import { useModal } from "@/hooks/use-modal-store";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import { useToast } from "./ui/use-toast";

export const MobileBottomNavbar = () => {
  const { user } = useClerk();
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
      icon: Home,
      href: "/",
    },
    {
      icon: Compass,
      href: "/explore",
    },
    {
      icon: Plus,
      href: "#",
    },
    {
      icon: ProfilePicture,
      href: `/${user?.id}`,
    },
  ];

  return (
    <div className="border-t-[1px] w-full flex justify-center fixed bottom-0 z-50 bg-white">
      <div className="flex justify-between items-center w-[100%] ">
        {routes.map((route, index) => (
          <div
            key={index}
            className="p-3 hover:scale-110 transition w-full flex justify-center"
          >
            {route.href && route.href !== "#" ? (
              <Link href={route.href}>
                <route.icon />
              </Link>
            ) : (
              <CldUploadWidget
                onUpload={onUpload}
                uploadPreset="fcbztrpi"
                options={{
                  maxFiles: 6,
                }}
              >
                {/*@ts-ignore*/}
                {({ open }) => <route.icon className="cursor-pointer" onClick={() => open?.()} />}
              </CldUploadWidget>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
