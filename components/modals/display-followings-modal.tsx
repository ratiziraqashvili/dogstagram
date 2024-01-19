"use client";

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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SkeletonItem from "../skeleton-item";
import { ProfilePicture } from "../profile-picture";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { useFollowingStore } from "@/hooks/use-following-store";

export const DisplayFollowingsModal = () => {
  //currentUser id
  const { userId } = useAuth();
  //getting states from zustand
  const { setIsFollowing, setFollowerCount, followerCount } =
    useFollowingStore();
  //storing followers of profile in this state
  const [followers, setFollowers] = useState<
    {
      follower: {
        username: string;
        imageUrl: string;
        firstName: string | null;
        clerkId: string;
      };
      isFollowing: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  //loader for only skeleton
  const [skeleton, setSkeleton] = useState(true);
  const [removedFollowers, setRemovedFollowers] = useState<string[]>([]);
  const { isOpen, onClose, type } = useModal();
  const otherUserId = usePathname().split("/")[1];
  const router = useRouter();

  const isModalOpen = isOpen && type === "displayFollowings";

  const handleClose = () => {
    onClose();
  };

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
          (follower: { follower: { clerkId: string } }) => {
            const isFollowing = followingIds.includes(
              follower.follower.clerkId
            );

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
  }, [otherUserId]);

  const onRemoveFollow = async (clerkId: string) => {
    //Making api req to remove/delete follow
    setIsLoading(true);
    try {
      await axios.delete(`/api/users/remove/${clerkId}`);

      setIsFollowing(false);
      setFollowerCount(followerCount - 1);
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
    setIsLoading(true);
    try {
      await axios.delete(`/api/users/unfollow/${clerkId}`);

      setFollowers((prevFollowers) => {
        const updated = prevFollowers.map((follower) => {
          if (follower.follower.clerkId === clerkId) {
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onFollow = async (clerkId: string) => {
    // Making req to api route to follow user
    setIsLoading(true);
    try {
      await axios.post("/api/users/follow", clerkId);

      setFollowers((prevFollowers) => {
        const updated = prevFollowers.map((follower) => {
          if (follower.follower.clerkId === clerkId) {
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
                .filter((follower) =>
                  follower.follower.username.includes(search)
                )
                .map((follower) => (
                  <div
                    className="flex justify-between pb-4"
                    key={follower.follower.username}
                  >
                    <div className="flex items-center space-x-4">
                      <Link
                        onClick={handleClose}
                        href={`/${follower.follower.clerkId}`}
                      >
                        <ProfilePicture
                          className="h-11 w-11 cursor-pointer"
                          imageUrl={follower.follower.imageUrl}
                        />
                      </Link>
                      <Link
                        onClick={handleClose}
                        href={`/${follower.follower.clerkId}`}
                      >
                        <div className="cursor-pointer">
                          <h2 className="font-semibold">
                            {follower.follower.username}
                          </h2>
                          <h2 className="text-muted-foreground">
                            {follower.follower.firstName}
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
                            removedFollowers.includes(follower.follower.clerkId)
                          }
                          className="h-[2rem] w-[6rem]"
                          onClick={() =>
                            onRemoveFollow(follower.follower.clerkId)
                          }
                          variant="default"
                        >
                          {removedFollowers.includes(follower.follower.clerkId)
                            ? "Removed"
                            : "Remove"}
                        </Button>
                      )}
                      {/* we are not showing buttons if user is currentUser because user can not follow ourself */}
                      {userId !== follower.follower.clerkId &&
                        userId !== otherUserId && (
                          <Button
                            className="h-[2rem] w-[6rem]"
                            variant={
                              follower.isFollowing !== undefined &&
                              follower.isFollowing
                                ? "default"
                                : "amber"
                            }
                            disabled={
                              isLoading || follower.isFollowing === undefined
                            }
                            onClick={() => {
                              follower.isFollowing
                                ? onUnfollow(follower.follower.clerkId)
                                : onFollow(follower.follower.clerkId);
                            }}
                          >
                            {follower.isFollowing === undefined
                              ? "Loading"
                              : follower.isFollowing
                              ? "Unfollow"
                              : "Follow"}
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
