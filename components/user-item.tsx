import { useRouter } from "next/navigation";
import { ProfilePicture } from "./profile-picture";
import SkeletonItem from "./skeleton-item";
import { SheetClose } from "./ui/sheet";
import { SearchUser } from "@/types";

interface UserItemProps {
  searchResults: {
    clerkId: string;
    firstName: string;
    imageUrl: string;
    username: string;
  }[];
  isFetching: boolean;
  addToRecentSearches: (searchResult: SearchUser[0]) => void;
  recentSearches: SearchUser;
}

export const UserItem = ({
  searchResults,
  isFetching,
  addToRecentSearches,
  recentSearches,
}: UserItemProps) => {
  const router = useRouter();

  if (isFetching) {
    return (
      <>
        {Array(9)
          .fill(undefined)
          .map((_, index) => (
            <SkeletonItem
              className="pt-3 px-6"
              firstSkeleton="h-[0.85rem] w-[140px] sm:w-[250px] rounded-sm"
              secondSkeleton="h-[0.85rem] w-[100px] sm:w-[210px] rounded-sm"
              key={index}
            />
          ))}
      </>
    );
  }

  if (recentSearches && searchResults.length === 0) {
    return (
      <div className="flex flex-col gap-2 pt-3">
        {recentSearches.map((result) => (
          <SheetClose key={result.clerkId} asChild>
            <div className="px-6 py-1 hover:bg-primary/5 transition cursor-pointer">
              <div className="flex gap-3 items-center">
                <ProfilePicture
                  imageUrl={result.imageUrl}
                  className="w-12 h-12"
                />
                <div className="flex flex-col">
                  <h1 className="text-sm font-semibold">{result.username}</h1>
                  <span className="text-sm text-muted-foreground">
                    {result.firstName}
                  </span>
                </div>
              </div>
            </div>
          </SheetClose>
        ))}
      </div>
    );
  }

  const onClick = (result: {
    clerkId: string;
    firstName: string;
    imageUrl: string;
    username: string;
  }) => {
    router.push(`/${result.clerkId}`);
    addToRecentSearches(result);
  };

  return (
    <div className="flex flex-col gap-2 pt-3 overflow-y-auto">
      {searchResults.map((result) => (
        <SheetClose key={result.clerkId} asChild>
          <div
            onClick={() => onClick(result)}
            className="px-6 py-1 hover:bg-primary/5 transition cursor-pointer"
          >
            <div className="flex gap-3 items-center">
              <ProfilePicture
                imageUrl={result.imageUrl}
                className="w-12 h-12"
              />
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold">{result.username}</h1>
                <span className="text-sm text-muted-foreground">
                  {result.firstName}
                </span>
              </div>
            </div>
          </div>
        </SheetClose>
      ))}
    </div>
  );
};
