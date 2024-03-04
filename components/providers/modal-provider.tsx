"use client";

import { useEffect, useState } from "react";
import { FollowingModal } from "../modals/following-modal";
import { SettingsModal } from "../modals/settings-modal";
import { MoreHorizontalModal } from "../modals/more-vertical-modal";
import { DisplayFollowersModal } from "../modals/display-followers-modal";
import { DisplayFollowingsModal } from "../modals/display-followings-modal";
import { AboutAccountModal } from "../modals/about-account-modal";
import { BlockConfirmModal } from "../modals/block-confirm-modal";
import { BlockIndicatorModal } from "../modals/block-indicator-modal";
import { ShareModal } from "../modals/share-modal";
import { CreatePostModal } from "../modals/create-post-modal";
import { PostInfoModal } from "../modals/post-info-modal";
import { PostPropertiesModal } from "../modals/post-properties-modal";
import { AboutPostModal } from "../modals/about-post-modal";
import { CommentDeleteModal } from "../modals/comment-delete-modal";
import { RestrictModal } from "../modals/restrict-modal";
import { StoryModal } from "../modals/story-modal";
import { ReportModal } from "../modals/report-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FollowingModal />
      <SettingsModal />
      <MoreHorizontalModal />
      <DisplayFollowersModal />
      <DisplayFollowingsModal />
      <AboutAccountModal />
      <BlockConfirmModal />
      <BlockIndicatorModal />
      <ShareModal />
      <CreatePostModal />
      <PostInfoModal />
      <PostPropertiesModal />
      <AboutPostModal />
      <CommentDeleteModal />
      <RestrictModal />
      <StoryModal />
      <ReportModal />
    </>
  );
};
