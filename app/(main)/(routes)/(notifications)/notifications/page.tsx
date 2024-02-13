import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

const NotificationPage = async () => {
    const user = await currentUser();

    const notifications = await db.notification.findMany({
        where: {
            recipient: user?.id
        },
        
    })

    return (
        <div>
            
        </div>
    )
}

export default NotificationPage;