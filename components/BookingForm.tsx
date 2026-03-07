"use client";

import { useState, useEffect } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

type BookingFormProps = {
    eventType: any,
    user: any
};

export function BookingForm({ eventType, user }: BookingFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Checkout phase
    const [showCheckout, setShowCheckout] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Success state
    const [isSuccess, setIsSuccess] = useState(false);

    // Generate next 14 days for selection
    const days = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

    // Fetch slots when date changes
    useEffect(() => {
        if (!selectedDate) return;

        async function fetchSlots() {
            setLoadingSlots(true);
            try {
                const dateStr = format(selectedDate as Date, "yyyy-MM-dd");
                const res = await fetch(`/api/availability?userId=${user.id}&date=${dateStr}&duration=${eventType.duration}`);

                if (res.ok) {
                    const slots = await res.json();
                    setAvailableSlots(slots);
                } else {
                    setAvailableSlots([]);
                }
            } catch (error) {
                setAvailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        }

        fetchSlots();
        setSelectedTime(null);
    }, [selectedDate, user.id, eventType.duration]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTime || !name || !email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventTypeId: eventType.id,
                    name,
                    email,
                    startTime: selectedTime,
                }),
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert("Failed to confirm booking. The time may have been taken.");
            }
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        // Generate Google Calendar Add Link
        const startParams = selectedTime ? new Date(selectedTime).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
        const endParams = selectedTime ? addMinutes(new Date(selectedTime), eventType.duration).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";

        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${eventType.title} with ${user.name}`)}&dates=${startParams}/${endParams}&details=${encodeURIComponent(eventType.description || "")}`;

        return (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in p-8 delay-100">
                <div className="w-20 h-20 rounded-full bg-success-color/20 text-success-color flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">You are scheduled</h2>
                <p className="text-gray-400 mb-2">A calendar invitation has been sent to your email address.</p>

                <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-6 py-3 bg-[#ffffff10] hover:bg-[#ffffff20] border border-[#ffffff20] text-white rounded-xl font-medium transition-all flex items-center gap-2"
                >
                    Add to Google Calendar
                </a>

                <div className="mt-8 p-6 glass-panel w-full border border-success-color/30 rounded-xl">
                    <p className="text-white font-semibold mb-1">{eventType.title} with {user.name}</p>
                    <p className="text-gray-400">{selectedTime ? format(new Date(selectedTime), "EEEE, MMMM d, yyyy 'at' h:mm a") : ""}</p>
                </div>
            </div>
        );
    }

    if (showCheckout) {
        return (
            <div className="animate-fade-in">
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="text-sm font-medium text-primary-color hover:text-white transition-colors mb-4 inline-block"
                    >
                        ← Change Date/Time
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-2">Enter Details</h2>
                    <p className="text-gray-400">
                        {selectedTime ? format(new Date(selectedTime), "EEEE, MMMM d, yyyy 'at' h:mm a") : ""}
                    </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                        <input
                            id="name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input-field"
                            placeholder="Your full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Format</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full shadow-[0_4px_20px_rgba(99,102,241,0.25)] flex justify-center py-4"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : "Schedule Event"}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="animate-fade-in flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-6">Select a Date & Time</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Date Selection */}
                <div>
                    <p className="font-semibold text-gray-300 mb-4 px-2 tracking-wide uppercase text-sm">Upcoming 14 Days</p>
                    <div className="grid grid-cols-2 gap-2">
                        {days.map((day) => {
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`p-3 text-center rounded-xl border transition-all ${isSelected
                                        ? "bg-primary-color border-primary-color text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                        : "bg-[#ffffff05] border-[#ffffff10] text-gray-300 hover:bg-[#ffffff10] hover:border-[#ffffff20]"
                                        }`}
                                >
                                    <span className="block text-xs mb-1 opacity-80">{format(day, "MMM")}</span>
                                    <span className="block text-lg font-bold">{format(day, "d")}</span>
                                    <span className="block text-xs mt-1 opacity-80">{format(day, "EEE")}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="border-l lg:border-[#ffffff10] lg:pl-8 pt-6 lg:pt-0">
                    <p className="font-semibold text-gray-300 mb-4 tracking-wide uppercase text-sm">
                        {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Time Slots"}
                    </p>

                    {!selectedDate ? (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm p-8 border-2 border-dashed border-[#ffffff10] rounded-xl">
                            Select a date to view available times
                        </div>
                    ) : loadingSlots ? (
                        <div className="h-full flex flex-col items-center justify-center text-primary-color pt-12">
                            <Loader2 size={24} className="animate-spin mb-4" />
                            <span className="text-sm text-gray-400">Loading times...</span>
                        </div>
                    ) : availableSlots.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 bg-[#ffffff05] rounded-xl p-8 text-center text-sm border border-[#ffffff10]">
                            No times available on this date.
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableSlots.map((slot) => {
                                const isSelected = selectedTime === slot;
                                const dateObj = new Date(slot);
                                return (
                                    <div key={slot} className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedTime(slot)}
                                            className={`flex-1 p-4 rounded-xl text-center font-bold font-mono transition-all border ${isSelected
                                                ? "bg-[#ffffff20] border-gray-400 text-white"
                                                : "bg-transparent border-[#primary-color] text-primary-color border-primary-color hover:bg-primary-color hover:text-white"
                                                }`}
                                        >
                                            {format(dateObj, "h:mm a")}
                                        </button>

                                        {isSelected && (
                                            <button
                                                className="p-4 rounded-xl bg-primary-color text-white font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center justify-center w-[120px] animate-fade-in"
                                                onClick={() => setShowCheckout(true)}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
