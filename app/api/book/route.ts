import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGoogleCalendarClient } from "@/lib/google";
import { addMinutes } from "date-fns";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventTypeId, name, email, startTime, customAnswers } = body;

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

        // Parse custom answers for description
        let answersText = "";
        try {
            if (customAnswers) {
                const parsed = JSON.parse(customAnswers);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    answersText = "\n\n--- Qualification Answers ---\n" + parsed.map((a: any) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n");
                }
            }
        } catch (e) {
            console.error(e);
        }

        // 1. Create Google Calendar Event
        const calendar = await getGoogleCalendarClient(eventType.userId);

        const event = await calendar.events.insert({
            calendarId: "primary",
            sendUpdates: "all",
            conferenceDataVersion: 1, // Required to create a conference
            requestBody: {
                summary: `${eventType.title} with ${name}`,
                description: `Event booked via 2BookUrMeetings.\n\nAttendee Name: ${name}\nAttendee Email: ${email}\n\n${eventType.description || ""}${answersText}`,
                start: { dateTime: start.toISOString() },
                end: { dateTime: end.toISOString() },
                attendees: [{ email }],
                conferenceData: {
                    createRequest: {
                        requestId: Math.random().toString(36).substring(7), // Random short string
                        conferenceSolutionKey: {
                            type: "hangoutsMeet"
                        }
                    }
                }
            },
        });

        // Extract meet link if available
        const meetLink = event.data.hangoutLink || null;

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
                customAnswers: customAnswers || null,
            }
        });

        return NextResponse.json({ ...booking, meetLink });
    } catch (error) {
        console.error("[BOOK_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
