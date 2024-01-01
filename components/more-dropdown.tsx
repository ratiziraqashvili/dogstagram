import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";

export const MoreDropDown = () => {
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-4 p-3  w-full cursor-pointer">
          <Menu className="w-7 h-7" />
          <span className="hidden lg:block text-md font-[500] pt-[0.20rem]">
            More
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="w-56 p-2 ml-2">
        <DropdownMenuItem className="h-12">
          <button onClick={() => signOut()} className="text-md">Log out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
