import { MobileBottomNavbar } from "@/components/mobile-bottom-navbar"
import { MobileNavbar } from "@/components/mobile-navbar"
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

export const NavContainer = async () => {
    const user = await currentUser();

    const unReadNotiCount = await db.notification.count({
      where: {
        recipient: user?.id,
        isRead: false,
      },
    });

    return (
        <>
        <MobileNavbar unReadNotiCount={unReadNotiCount} />
        <MobileBottomNavbar />
        </>
    )
}