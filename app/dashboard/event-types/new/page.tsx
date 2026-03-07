"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewEventTypePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            duration: formData.get("duration"),
            slug: (formData.get("slug") as string)?.toLowerCase()
        };

        // Basic formatting for slug
        data.slug = (formData.get("slug") as string)?.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

        try {
            const res = await fetch("/api/event-types", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Something went wrong.");
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back
            </Link>

            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create Event Type</h1>
                <p className="text-gray-400">Define a new type of meeting people can book with you.</p>
            </div>

            <div className="glass-panel p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Event Name</label>
                        <input id="title" name="title" required className="input-field" placeholder="e.g. 30 Min Call" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-300">Duration (Minutes)</label>
                            <input id="duration" name="duration" type="number" min="5" max="480" required className="input-field" placeholder="30" defaultValue="30" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-300">Custom Link Slug</label>
                            <input id="slug" name="slug" required className="input-field" placeholder="e.g. 30-min-call" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description (Optional)</label>
                        <textarea id="description" name="description" rows={4} className="input-field resize-none" placeholder="Let your invitee know what to expect..."></textarea>
                    </div>

                    {error && <p className="text-sm text-danger-color font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>}

                    <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Save Event Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
