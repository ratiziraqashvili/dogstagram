import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  console.log("cron job worked")
    try {
        const now = new Date();

        const expiredRestricts = await db.restrict.findMany({
            where: {
                expiry: {
                    lte: now
                }
            }
        })
        
        let deletedRestrict;

        for (const restrict of expiredRestricts) {
            deletedRestrict = await db.restrict.delete({
              where: {
                userId_restrictedUserId: {
                  userId: restrict.userId, 
                  restrictedUserId: restrict.restrictedUserId
                }
              }
            })
          }


          return NextResponse.json(deletedRestrict);

    } catch (error) {
        console.error("error in [API_CRONJOB]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}