import { Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import qs from "query-string";
import axios from "axios";
import { UserItem } from "./user-item";
import { SearchUser } from "@/types";
import { useAuth } from "@clerk/nextjs";

export const SearchSheet = () => {
  const { userId } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchUser>(() => {
    if (typeof window !== "undefined") {
      const savedSearches = localStorage.getItem(`recentSearches_${userId}`);
      return savedSearches ? JSON.parse(savedSearches) : [];
    }
    return [];
  });
  const [searchResults, setSearchResults] = useState<SearchUser | never[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onClear = (e: React.SyntheticEvent) => {
    e.stopPropagation();

    inputRef.current!.value = "";
    setSearchTerm("");
    setSearchResults([]);
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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSearchTerm(e.target.value);
    } else {
      inputRef.current!.value = "";
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  const fetchUsers = async (searchTerm: string) => {
    setIsFetching(true);
    try {
      if (searchTerm) {
        const url = qs.stringifyUrl({
          url: "/api/users",
          query: {
            username: searchTerm,
          },
        });

        const res = await axios.get(url);
        setSearchResults(res.data);
      }
    } catch (error) {
      console.error("error in [COMPONENTS_SEARCH-SHEET]", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    //debounce to avoid unnecessary db query
    const delay = setTimeout(() => {
      if (searchTerm) {
        fetchUsers(searchTerm);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const clearFetch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const saveRecentSearchesToLocalStorage = (searches: SearchUser) => {
    if (localStorage.getItem(`clickedUserProfile_${userId}`)) {
      localStorage.setItem(
        `recentSearches_${userId}`,
        JSON.stringify(searches)
      );
      localStorage.removeItem(`clickedUserProfile_${userId}`); //remove flag after saving
    }
  };

  const addToRecentSearches = (searchResult: SearchUser[0]) => {
    localStorage.setItem(`clickedUserProfile_${userId}`, "true");
    // add the username to recent searches
    setRecentSearches((prevRecentSearches) => [
      searchResult,
      ...prevRecentSearches.slice(0, 9),
    ]);
    saveRecentSearchesToLocalStorage(recentSearches);
  };

  return (
    <Sheet onOpenChange={clearFetch}>
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
                onChange={onInputChange}
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
        {!searchTerm && (
          <div className="pl-6 pr-3 py-3">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Recent</h1>
              <Button
                className="transition-none text-amber-600"
                variant="ghost"
                onClick={() => setRecentSearches([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
        <UserItem
          isFetching={isFetching}
          searchResults={searchResults}
          addToRecentSearches={addToRecentSearches}
          recentSearches={recentSearches}
        />
      </SheetContent>
    </Sheet>
  );
};
