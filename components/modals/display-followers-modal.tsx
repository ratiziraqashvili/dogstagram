import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useModal } from "@/hooks/use-modal-store";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonItem from "../skeleton-item";
import { ProfilePicture } from "../profile-picture";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import Link from "next/link";
import qs from "query-string";

export const DisplayFollowersModal = () => {
  //currentUser id
  const { userId } = useAuth();
  //storing followers of profile in this state
  const [followers, setFollowers] = useState<
    {
      username: string;
      imageUrl: string;
      firstName: string | null;
      clerkId: string;
      isFollowing: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  //loader for only skeleton
  const [skeleton, setSkeleton] = useState(true);
  const [removedFollowers, setRemovedFollowers] = useState<string[]>([]);
  const { isOpen, onClose, type } = useModal();
  const params = useParams();
  const otherUserId = params.userId;
  const router = useRouter();
  const { toast } = useToast();

  const isModalOpen = isOpen && type === "displayFollowers";

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setFollowers([]);
      setSkeleton(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // Fetch users who follow current profile
    const fetchFollowers = async () => {
      try {
        // Fetch followers that currentProfile has
        const response = await axios.get(`/api/${otherUserId}/followerdata`);
        const followersList = response.data;

        // Fetch following ids for current user
        const followingRes = await axios.get(`/api/followerlist/${userId}`);
        const followingIds = followingRes.data;

        const updatedFollowers = followersList.map(
          (follower: { clerkId: string }) => {
            const isFollowing = followingIds.includes(follower.clerkId);

            return {
              ...follower,
              isFollowing,
            };
          }
        );

        setFollowers(updatedFollowers);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setSkeleton(false);
      }
    };

    fetchFollowers();
  }, [isModalOpen, otherUserId, userId]);

  const onRemoveFollow = async (clerkId: string) => {
    //Making api req to remove/delete follow
    setIsLoading(true);
    try {
      await axios.delete(`/api/users/remove/${clerkId}`);

      setRemovedFollowers((prevRemoved) => [...prevRemoved, clerkId]);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUnfollow = async (clerkId: string) => {
    // making req to api route to unfollow user
    try {
      setFollowers((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: false } : f
        )
      );

      await axios.delete(`/api/users/unfollow/${clerkId}`);

      setFollowers((prevFollowers) => {
        const updated = prevFollowers.map((follower) => {
          if (follower.clerkId === clerkId) {
            return {
              ...follower,
              isFollowing: false,
            };
          }
          return follower;
        });
        return updated;
      });

      router.refresh();
    } catch (error: any) {
      setFollowers((prev) =>
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
      setFollowers((prev) =>
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

      setFollowers((prevFollowers) => {
        const updated = prevFollowers.map((follower) => {
          if (follower.clerkId === clerkId) {
            return {
              ...follower,
              isFollowing: true,
            };
          }
          return follower;
        });
        return updated;
      });

      router.refresh();
    } catch (error: any) {
      setFollowers((prev) =>
        prev.map((f) =>
          f.clerkId === clerkId ? { ...f, isFollowing: false } : f
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
            {followers.length === 0 && !skeleton && (
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
              {followers
                .filter((follower) => follower?.username?.includes(search))
                .map((follower) => (
                  <div
                    className="flex justify-between pb-4"
                    key={follower.username}
                  >
                    <div className="flex items-center space-x-4">
                      <Link onClick={handleClose} href={`/${follower.clerkId}`}>
                        <ProfilePicture
                          className="h-11 w-11 cursor-pointer"
                          imageUrl={follower.imageUrl}
                        />
                      </Link>
                      <Link onClick={handleClose} href={`/${follower.clerkId}`}>
                        <div className="cursor-pointer">
                          <h2 className="font-semibold">{follower.username}</h2>
                          <h2 className="text-muted-foreground">
                            {follower.firstName}
                          </h2>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center">
                      {/* if user is on current profile show remove button instead of follow/unfollow which is useless in this occasion */}
                      {userId === otherUserId && (
                        <Button
                          disabled={
                            isLoading ||
                            removedFollowers.includes(follower.clerkId)
                          }
                          className="h-[2rem] w-[6rem]"
                          onClick={() => onRemoveFollow(follower.clerkId)}
                          variant="default"
                        >
                          {removedFollowers.includes(follower.clerkId)
                            ? "Removed"
                            : "Remove"}
                        </Button>
                      )}
                      {/* we are not showing buttons if user is currentUser because user can not follow ourself */}
                      {userId !== follower.clerkId &&
                        userId !== otherUserId && (
                          <Button
                            className="h-[2rem] w-[6rem]"
                            variant={follower.isFollowing ? "default" : "amber"}
                            onClick={() => {
                              follower.isFollowing
                                ? onUnfollow(follower.clerkId)
                                : onFollow(follower.clerkId);
                            }}
                          >
                            {follower.isFollowing ? "Unfollow" : "Follow"}
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
