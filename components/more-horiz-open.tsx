"use client";

import { useSecondModal } from "@/hooks/use-second-modal-store";
import { SinglePost } from "@/types";
import { MoreHorizontal } from "lucide-react";

export const MoreHorizOpen = ({ post }: { post: SinglePost }) => {
  const { onOpen } = useSecondModal();

  const onPostPropertiesModalOpen = () => {
    onOpen("postProperties", post);
  };

  return (
    <MoreHorizontal
      className="h-6 w-6 cursor-pointer"
      onClick={onPostPropertiesModalOpen}
    />
  );
};
