import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { EventTypeCard } from "@/components/EventTypeCard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { eventTypes: true }
    });

    const username = user?.username;

    // This helps us build absolute URLs securely. Note: in production, `NEXT_PUBLIC_APP_URL` should be used.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return (
        <div className="space-y-8 animate-fade-in mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Event Types</h1>
                    <p className="text-gray-400">Create and manage your booking pages.</p>
                </div>

                <Link href="/dashboard/event-types/new" className="btn-primary">
                    <Plus size={18} />
                    New Event Type
                </Link>
            </div>

            {!username && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 flex items-center justify-between">
                    <p>Please setup your username in settings before sharing your booking link.</p>
                    <Link href="/dashboard/settings" className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md transition-colors text-sm font-medium text-yellow-100">
                        Go to Settings
                    </Link>
                </div>
            )}

            {user?.eventTypes.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-[#ffffff10]">
                    <div className="w-16 h-16 bg-[#ffffff05] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Event Types yet</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">Create your first event type to let people book meetings with you directly on your calendar.</p>
                    <Link href="/dashboard/event-types/new" className="btn-primary">
                        <Plus size={18} />
                        Create Event Type
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user?.eventTypes.map((eventType: any) => (
                        <EventTypeCard
                            key={eventType.id}
                            eventType={eventType}
                            username={username || null}
                            baseUrl={baseUrl}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
