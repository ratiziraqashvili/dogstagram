"use client";

import { useEffect, useState } from "react";
import { FollowingModal } from "../modals/following-modal";
import { SettingsModal } from "../modals/settings-modal";
import { MoreHorizontalModal } from "../modals/more-vertical-modal";

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
        </>
    )
}