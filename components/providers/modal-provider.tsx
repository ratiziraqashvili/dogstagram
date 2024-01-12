"use client";

import { useEffect, useState } from "react";
import { FollowingModal } from "../modals/following-modal";

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
        </>
    )
}