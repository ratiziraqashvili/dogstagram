import { Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SearchSheetProps {}

export const SearchSheet = ({}: SearchSheetProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    inputRef.current!.value = "";
    setIsSearching(false);
  };

  const onClick = () => {
    setIsSearching(true);
  };

  const onBlur = () => {
    if (!inputRef.current?.value) {
      setIsSearching(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex gap-4 items-center relative h-full xl:w-[200px]">
          <div>
            <Search className="w-6 h-6 group-hover:scale-105 transition" />
          </div>
          <span className="hidden xl:block text-md">Search</span>
        </div>
      </SheetTrigger>
      <SheetContent className="p-0" side="left">
        <div className="py-6 border-b-[1px]">
          <SheetHeader className="px-6">
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>
          <div className="pt-7 px-6">
            <div onClick={onClick} className="relative">
              <Input
                placeholder="Search"
                onBlur={onBlur}
                ref={inputRef}
                className={cn(
                  "bg-primary/5 h-9 pl-10 text-muted-foreground",
                  isSearching && "pl-4"
                )}
              />
              {isSearching && (
                <X
                  onBlur={onBlur}
                  onClick={onClear}
                  className="absolute right-2 w-[1.1rem] h-[1.1rem] top-[0.6rem] text-muted-foreground opacity-80 cursor-pointer"
                />
              )}
              {!isSearching && (
                <Search
                  onBlur={onBlur}
                  className="absolute left-4 top-[0.6rem] w-[1.1rem] h-[1.1rem] text-muted-foreground opacity-80"
                />
              )}
            </div>
          </div>
        </div>
        <div className="pl-6 pr-3 py-3">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold">Recent</h1>
                <Button className="transition-none" variant="ghost">Clear All</Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
