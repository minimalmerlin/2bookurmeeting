import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGoogleCalendarClient } from "@/lib/google";
import { addMinutes } from "date-fns";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventTypeId, name, email, startTime } = body;

        if (!eventTypeId || !name || !email || !startTime) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const eventType = await prisma.eventType.findUnique({
            where: { id: eventTypeId },
            include: { user: true }
        });

        if (!eventType) {
            return new NextResponse("Event type not found", { status: 404 });
        }

        const start = new Date(startTime);
        const end = addMinutes(start, eventType.duration);

        // 1. Create Google Calendar Event
        const calendar = await getGoogleCalendarClient(eventType.userId);

        const event = await calendar.events.insert({
            calendarId: "primary",
            sendUpdates: "all",
            requestBody: {
                summary: `${eventType.title} with ${name}`,
                description: `Event booked via CalendlyClone.\n\nAttendee Name: ${name}\nAttendee Email: ${email}\n\n${eventType.description || ""}`,
                start: { dateTime: start.toISOString() },
                end: { dateTime: end.toISOString() },
                attendees: [{ email }],
            },
        });

        // 2. Save Booking to Database
        const booking = await prisma.booking.create({
            data: {
                eventTypeId: eventType.id,
                userId: eventType.userId,
                attendeeName: name,
                attendeeEmail: email,
                startTime: start,
                endTime: end,
                googleEventId: event.data.id,
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.error("[BOOK_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
