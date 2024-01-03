"use client"

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs"
import { Settings } from "lucide-react";

export const ProfileInfo = () => {
    const { user } = useClerk();

    return (
        <div>
            <div className="flex gap-12 md:gap-24 justify-between items-center pt-2">
                <div>
                    <span className="text-xl">{user?.username}</span>
                </div>
                <div className="flex gap-2">
                    <Button className="h-[2rem]" variant="default">
                        View archive
                    </Button>
                    <button>
                        <Settings />
                    </button>
                </div>
            </div>
        </div>
    )
}