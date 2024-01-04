"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Heart, Search, X } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const MobileNavbar = () => {
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
    <nav className="border-b-[1px] h-[3.8rem] flex justify-between items-center w-full fixed">
      <div className="cursor-pointer">
        <Link href="/">
          <Image src="/logo.png" alt="Dogstagram" width={130} height={130} unoptimized  />
        </Link>
      </div>
      <div className="flex items-center gap-3 pr-5">
        <div onClick={onClick} className="relative">
          <Input
            placeholder="Search"
            onBlur={onBlur}
            ref={inputRef}
            className={cn(
              "bg-primary/5 sm:w-[16rem] h-9 pl-10 text-muted-foreground w-[10rem]",
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
        <Link href="/notifications">
        <Heart className="w-6 h-6 cursor-pointer hover:scale-105 transition" />
        </Link>
      </div>
    </nav>
  );
};
