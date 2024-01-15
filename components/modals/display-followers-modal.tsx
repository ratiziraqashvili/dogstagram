"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const DisplayFollowersModal = () => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onClose, type } = useModal();
  const userId = usePathname().split("/")[1];

  useEffect(() => {
    // Fetch following data
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/api/${userId}/followerdata`)

        setFollowers(response.data);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  const isModalOpen = isOpen && type === "displayFollowers";

  const handleClose = () => {
    onClose();
  };

  return (
    <CommandDialog open={isModalOpen} onOpenChange={handleClose}>
      <div className="flex justify-center items-center p-2 border-b-[1px] w-full">
        <span className="font-semibold">Followers</span>
        <X
          onClick={handleClose}
          className="w-5 h-5 absolute right-4 top-2.5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer"
        />
      </div>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="">
            <CommandItem>
                
            </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
