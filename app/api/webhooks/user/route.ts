import { db } from "@/lib/db";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix"

const webhookSecret = process.env.WEBHOOK_SECRET!

async function handler(request: Request) {
    const payload = await request.json();
    const headersList = headers();
    const ipAddress = headersList.get("x-forwarded-for");
    const heads = {
        "svix-id": headersList.get("svix-id"),
        "svix-timestamp": headersList.get("svix-timestamp"),
        "svix-signature": headersList.get("svix-signature"),
    }
    const wh = new Webhook(webhookSecret)
    let evt: Event | null  = null;

    try {
        evt = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
    } catch (error) {
        console.error((error as Error).message)
        return NextResponse.json("Error", { status: 400 })
    }

    const eventType: EventType = evt.type

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, first_name, username, email_addresses, image_url } = evt.data;

        const email_address = email_addresses[0].email_address;

        const res = await fetch(`https://ipinfo.io/${ipAddress}?token=${process.env.IPINFO_TOKEN}`);
        const locationData = await res.json();
      
        const country = locationData.country;

       const user = await db.user.upsert({
            where: {
                clerkId: id as string
            },
            create: {
                clerkId: id as string,
                firstName: first_name as string,
                username: username as string,
                email: email_address as string,
                imageUrl: image_url as string,
                location: country || null
            },
            update: {
                firstName: first_name as string,
                username: username as string,
                email: email_address as string,
                imageUrl: image_url as string,
                location: country || null
            }
        })

        return NextResponse.json(user)
    }

    return NextResponse.json(null)
}

type EventType = "user.created" | "user.updated"  |  "*";

interface EventData {
    id: string;
    first_name: string;
    username: string;
    email_addresses: {
      email_address: string;
    }[];
    image_url: string;
  }

type Event = {
    data:  EventData,
    object: "event",
    type: EventType,
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;