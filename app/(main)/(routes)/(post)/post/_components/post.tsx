"use client"

import { CommentSection } from "@/components/comment-section";
import { PostInput } from "@/components/post-input";
import { ProfilePicture } from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import { formatTimeDifference } from "@/lib/timeUtils";
import { SinglePost } from "@/types";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PostProps {
  post: SinglePost | null;
}

export const Post = ({ post }: PostProps) => {
  const { onOpen } = useSecondModal();
  const [flag, setFlag] = useState("");

  const formattedTime = formatTimeDifference(post?.createdAt!);

  useEffect(() => {
    if (post?.location) {
      const fetchLocations = async () => {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${post?.location}?fields=flags`
        );

        setFlag(res.data[0].flags.svg);
      };

      fetchLocations();
    } else return;
  }, [post?.location]);

  const onPostPropertiesModalOpen = () => {
    onOpen("postProperties", post);
  };

  return (
    <>
      <div className="flex md:hidden justify-between items-center py-5 px-3">
        <div className="flex items-center gap-2">
          <Link href={`/${post?.userId}`}>
            <ProfilePicture
              className="w-8 h-8 cursor-pointer"
              imageUrl={post?.user.imageUrl}
            />
          </Link>
          <Link href={`/${post?.userId}`}>
            <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
              {post?.user.username}
            </span>
            {post?.location && (
              <span className="text-sm font-semibold flex items-center gap-2">
                <span className="relative w-5 h-3">
                  <Image alt="location flag" fill src={flag ?? ""} />
                </span>
                {post?.location}
              </span>
            )}
          </Link>
        </div>
        <div>
          <Button className="p-0 hover:text-black" variant="ghost">
            <MoreHorizontal
              onClick={onPostPropertiesModalOpen}
              className="h-5 w-5"
            />
          </Button>
        </div>
      </div>
      <div className="aspect-auto z-50 bg-black flex items-center md:overflow-hidden">
          <CldImage
            src={post?.imageUrl!}
            alt="Image"
            width="600"
            height="664"
            crop="fill"
            className="object-cover md:min-w-24"
            priority
          />
        </div>
        <div className="md:min-w-[10rem] w-full max-w-[39.2rem]  flex flex-col">
          <div className="md:flex hidden items-center justify-between  gap-2 py-5 px-3">
            <div className="flex items-center gap-3">
              <Link href={`/${post?.userId}`}>
                <ProfilePicture
                  className="h-8 w-8"
                  imageUrl={post?.user.imageUrl}
                />
              </Link>
              <Link href={`/${post?.userId}`}>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold cursor-pointer hover:text-muted-foreground">
                    {post?.user.username}
                  </span>
                  {post?.location && (
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <span className="relative h-3 w-5">
                        <Image alt="location flag" fill src={flag} />
                      </span>
                      {post?.location}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div>
              <Button
                className="hover:text-muted-foreground p-0"
                variant="ghost"
              >
                <MoreHorizontal
                  onClick={onPostPropertiesModalOpen}
                  className="h-5 w-5"
                />
              </Button>
            </div>
          </div>
          {/* <div className="flex-1 order-2 md:order-1 overflow-y-auto">
            <CommentSection
              formattedTime={formattedTime}
              comments={comments}
              post={post}
            />
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-4">
            <PostInput
              restrictedUsers={restrictedUsers}
              formattedTime={formattedTime}
              isLiked={isLiked}
              post={post}
              isFavorited={isFavorited}
            />
          </div> */}
        </div>
    </>
  );
};
