import { NextResponse } from "next/server";
import { getGoogleCalendarClient } from "@/lib/google";
import { addMinutes, isBefore, isSameDay, parseISO, setHours, setMinutes, startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const dateStr = searchParams.get("date"); // YYYY-MM-DD
        const durationStr = searchParams.get("duration"); // minutes

        if (!userId || !dateStr || !durationStr) {
            return new NextResponse("Missing parameters", { status: 400 });
        }

        const duration = parseInt(durationStr);
        const selectedDate = parseISO(dateStr);

        if (isNaN(selectedDate.getTime())) {
            return new NextResponse("Invalid date", { status: 400 });
        }

        const calendar = await getGoogleCalendarClient(userId);

        // Default working hours: 09:00 to 17:00 local time (simplify for MVP)
        const dayStart = setMinutes(setHours(selectedDate, 9), 0);
        const dayEnd = setMinutes(setHours(selectedDate, 17), 0);

        // Convert to ISO strings for Google API
        const timeMin = startOfDay(selectedDate).toISOString();
        const timeMax = endOfDay(selectedDate).toISOString();

        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                items: [{ id: "primary" }],
            },
        });

        const busySlots = response.data.calendars?.primary?.busy || [];

        // Generate possible slots
        const possibleSlots: Date[] = [];
        let currentSlot = dayStart;

        while (isBefore(addMinutes(currentSlot, duration), dayEnd) || currentSlot.getTime() === dayEnd.getTime() - duration * 60000) {
            // Check if current slot is in the past (if today)
            if (isBefore(currentSlot, new Date())) {
                currentSlot = addMinutes(currentSlot, 30); // 30 min intervals
                continue;
            }

            // Check if current slot conflicts with any busy slot
            const slotEnd = addMinutes(currentSlot, duration);
            const isBusy = busySlots.some((busy) => {
                if (!busy.start || !busy.end) return false;
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);

                // Conflict if slot overlaps with busy period
                return (
                    (currentSlot >= busyStart && currentSlot < busyEnd) ||
                    (slotEnd > busyStart && slotEnd <= busyEnd) ||
                    (currentSlot <= busyStart && slotEnd >= busyEnd)
                );
            });

            if (!isBusy) {
                possibleSlots.push(currentSlot);
            }

            // Increment by 30 mins standard interval
            currentSlot = addMinutes(currentSlot, 30);
        }

        return NextResponse.json(possibleSlots.map(d => d.toISOString()));
    } catch (error) {
        console.error("[AVAILABILITY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
