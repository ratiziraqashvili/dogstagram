"use client";

import { useEffect, useState } from "react";
import { FollowingModal } from "../modals/following-modal";
import { SettingsModal } from "../modals/settings-modal";
import { MoreHorizontalModal } from "../modals/more-vertical-modal";
import { DisplayFollowersModal } from "../modals/display-followers-modal";
import { DisplayFollowingsModal } from "../modals/display-followings-modal";
import { AboutAccountModal } from "../modals/about-account-modal";
import { BlockConfirmModal } from "../modals/block-confirm-modal";
import { BlockIndicator } from "../modals/block-indicator-modal";
import { ShareModal } from "../modals/share-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

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
          <BlockIndicator />
          <ShareModal />
        </>
    )
}