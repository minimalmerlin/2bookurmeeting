"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User as UserIcon } from "lucide-react";

export function SettingsForm({ initialUsername }: { initialUsername: string }) {
    const router = useRouter();
    const [username, setUsername] = useState(initialUsername || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.toLowerCase() }),
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Something went wrong.");
            }

            setSuccess("Username updated successfully.");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Public Username</label>
                <div className="relative flex rounded-md shadow-sm">
                    <div className="flex-1 bg-gray-50 border border-r-0 dark:border-gray-700 dark:bg-gray-800 p-2 sm:p-2.5 rounded-l-md flex items-center">
                        <span className="text-gray-500 text-sm font-medium">2bookurmeetings.vercel.app/</span>
                    </div>
                    <input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field pl-[140px]"
                        placeholder="your-name"
                    />
                </div>
                <p className="text-xs text-gray-500">This will be your public URL to share with others.</p>
            </div>

            {error && <p className="text-sm text-danger-color font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>}
            {success && <p className="text-sm text-success-color font-medium bg-green-500/10 p-3 rounded-md border border-green-500/20">{success}</p>}

            <div className="pt-4 border-t border-[#ffffff10] flex justify-end">
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <UserIcon size={16} className="mr-2" />}
                    Save Profile
                </button>
            </div>
        </form>
    );
}
