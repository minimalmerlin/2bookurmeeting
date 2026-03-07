"use client";

import React, { useState } from "react";
import { Loader2, Save } from "lucide-react";

type DayHour = {
    day: number;
    start: string;
    end: string;
};

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AvailabilityForm({ initialHours }: { initialHours: DayHour[] }) {
    // Fill out missing days with disabled state (empty strings)
    const [hours, setHours] = useState<DayHour[]>(() => {
        const fullWeek = Array.from({ length: 7 }).map((_, i) => {
            const existing = initialHours.find(h => h.day === i);
            return existing || { day: i, start: "", end: "" };
        });
        return fullWeek;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const handleToggleDay = (dayIndex: number, isActive: boolean) => {
        setHours(prev => prev.map(h =>
            h.day === dayIndex
                ? { ...h, start: isActive ? "09:00" : "", end: isActive ? "17:00" : "" }
                : h
        ));
    };

    const handleTimeChange = (dayIndex: number, field: "start" | "end", value: string) => {
        setHours(prev => prev.map(h =>
            h.day === dayIndex ? { ...h, [field]: value } : h
        ));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage("");

        // Filter out inactive days
        const activeHours = hours.filter(h => h.start !== "" && h.end !== "");

        try {
            const res = await fetch("/api/settings/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hours: activeHours }),
            });

            if (res.ok) {
                setMessage("Availability preferences saved successfully.");
            } else {
                setMessage("Error saving preferences.");
            }
        } catch (error) {
            setMessage("Error saving preferences.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
                {hours.map((h, i) => {
                    const isActive = h.start !== "" && h.end !== "";
                    return (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${isActive ? 'bg-[#ffffff08] border-[#ffffff20]' : 'opacity-60 border-transparent hover:border-[#ffffff10]'}`}>
                            <label className="flex items-center gap-3 w-32 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => handleToggleDay(i, e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-primary-color focus:ring-primary-color"
                                />
                                <span className="font-medium text-gray-200">{DAYS_OF_WEEK[i]}</span>
                            </label>

                            {isActive ? (
                                <div className="flex items-center gap-3 flex-1">
                                    <input
                                        type="time"
                                        value={h.start}
                                        onChange={(e) => handleTimeChange(i, "start", e.target.value)}
                                        className="bg-[#ffffff10] border border-[#ffffff20] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-color transition-colors"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="time"
                                        value={h.end}
                                        onChange={(e) => handleTimeChange(i, "end", e.target.value)}
                                        className="bg-[#ffffff10] border border-[#ffffff20] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-color transition-colors"
                                    />
                                </div>
                            ) : (
                                <div className="flex-1 text-sm text-gray-500 italic">Unavailable</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {message && (
                <p className={`text-sm ${message.includes("Error") ? "text-danger-color" : "text-success-color"}`}>
                    {message}
                </p>
            )}

            <button
                type="submit"
                disabled={isSaving}
                className="btn-primary"
            >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Availability
            </button>
        </form>
    );
}
