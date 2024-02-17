import { useRouter } from "next/navigation";
import { ProfilePicture } from "./profile-picture";
import SkeletonItem from "./skeleton-item";
import { SheetClose } from "./ui/sheet";

interface UserItemProps {
  searchResults: {
    clerkId: string;
    firstName: string;
    imageUrl: string;
    username: string;
  }[];
  isFetching: boolean;
}

export const UserItem = ({ searchResults, isFetching }: UserItemProps) => {
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

  if (searchResults.length === 0 && !isFetching) {
    return (
      <div className="h-[60%] flex justify-center items-center">
        <h1 className="text-[#9f9f9f] text-sm">No results found.</h1>
      </div>
    );
  }

  return (
    <div className="pt-3">
      {searchResults.map((result) => (
        <SheetClose asChild>
          <div
            onClick={() => router.push(`/${result.clerkId}`)}
            className="px-6 py-2 hover:bg-primary/5 transition cursor-pointer"
            key={result.clerkId}
          >
            <div className="flex gap-2 items-center">
              <ProfilePicture
                imageUrl={result.imageUrl}
                className="w-12 h-12"
              />
              <div className="flex flex-col">
                <h1 className="text-sm">{result.username}</h1>
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
