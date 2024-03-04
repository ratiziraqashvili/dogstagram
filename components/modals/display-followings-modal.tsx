import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonItem from "../skeleton-item";
import { ProfilePicture } from "../profile-picture";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import qs from "query-string";
import { useToast } from "../ui/use-toast";

export const DisplayFollowingsModal = () => {
  //currentUser id
  const { userId } = useAuth();
  //storing followers of profile in this state
  const [followings, setFollowings] = useState<
    {
      username: string;
      imageUrl: string;
      firstName: string | null;
      clerkId: string;
      isFollowing: boolean;
    }[]
  >([]);
  const [search, setSearch] = useState("");
  //loader for only skeleton
  const [skeleton, setSkeleton] = useState(true);
  const { isOpen, onClose, type } = useModal();
  const { toast } = useToast();
  

  const params = useParams();
  const otherUserId = params.userId;
  const router = useRouter();

  const isModalOpen = isOpen && type === "displayFollowings";

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setFollowings([]);
      setSkeleton(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // Fetch users who follow current profile
    const fetchFollowings = async () => {
      try {
        // Fetch followers that currentProfile has
        const response = await axios.get(`/api/${otherUserId}/followingdata`);
        const followingsList = response.data;

        // Fetch following ids for current user
        const followingRes = await axios.get(`/api/followerlist/${userId}`);
        const followingIds = followingRes.data;

        const updatedFollowings = followingsList.map(
          (following: { clerkId: string }) => {
            const isFollowing = followingIds.includes(following.clerkId);

            return {
              ...following,
              isFollowing,
            };
          }
        );

        setFollowings(updatedFollowings);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setSkeleton(false);
      }
    };

    fetchFollowings();
  }, [isModalOpen]);

  const onUnfollow = async (clerkId: string) => {
    // making req to api route to unfollow user
    try {
      setFollowings((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: false } : f
        )
      );

      await axios.delete(`/api/users/unfollow/${clerkId}`);

      setFollowings((prevFollowings) => {
        const updated = prevFollowings.map((following) => {
          if (following.clerkId === clerkId) {
            return {
              ...following,
              isFollowing: false,
            };
          }
          return following;
        });
        return updated;
      });

      router.refresh();
    } catch (error: any) {
      setFollowings((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: true } : f
        )
      );

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }

      console.error(error);
    }
  };

  const onFollow = async (clerkId: string) => {
    // Making req to api route to follow user
    try {
      setFollowings((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: true } : f
        )
      );

      const url = qs.stringifyUrl({
        url: "/api/users/follow",
        query: {
          otherUserId: clerkId,
        },
      });

      await axios.post(url);

      setFollowings((prevFollowings) => {
        const updated = prevFollowings.map((following) => {
          if (following.clerkId === clerkId) {
            return {
              ...following,
              isFollowing: true,
            };
          }
          return following;
        });
        return updated;
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      setFollowings((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: false } : f
        )
      );
    }
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
      <CommandInput
        onChangeCapture={(e) => {
          const input = e.target as HTMLInputElement;
          setSearch(input.value);
        }}
        placeholder="Search"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="">
          <CommandItem>
            {followings.length === 0 && !skeleton && (
              <div className="pl-[35.5%] whitespace-nowrap flex justify-center">
                <p className="text-muted-foreground">No result found.</p>
              </div>
            )}
            {skeleton && (
              <div className="flex flex-col gap-4">
                {Array(4)
                  .fill(undefined)
                  .map((_, index) => (
                    <SkeletonItem key={index} />
                  ))}
              </div>
            )}
            <div className="w-full">
              {followings
                .filter((following) => following.username.includes(search))
                .map((following) => (
                  <div
                    className="flex justify-between pb-4"
                    key={following.username}
                  >
                    <div className="flex items-center space-x-4">
                      <Link
                        onClick={handleClose}
                        href={`/${following.clerkId}`}
                      >
                        <ProfilePicture
                          className="h-11 w-11 cursor-pointer"
                          imageUrl={following.imageUrl}
                        />
                      </Link>
                      <Link
                        onClick={handleClose}
                        href={`/${following.clerkId}`}
                      >
                        <div className="cursor-pointer">
                          <h2 className="font-semibold">
                            {following.username}
                          </h2>
                          <h2 className="text-muted-foreground">
                            {following.firstName}
                          </h2>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center">
                      {/* we are not showing buttons if user is currentUser because user can not follow ourself */}
                      {userId !== following.clerkId && (
                        <Button
                          className="h-[2rem] w-[6rem]"
                          variant={following.isFollowing ? "default" : "amber"}
                          onClick={() => {
                            following.isFollowing
                              ? onUnfollow(following.clerkId)
                              : onFollow(following.clerkId);
                          }}
                        >
                          {following.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
