import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Settings, LogOut, Clock } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-[#0f172a]">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-[#ffffff10] flex flex-col m-4 mr-0">
                <div className="p-6 border-b border-[#ffffff10]">
                    <div className="flex items-center gap-2 px-2 text-white font-semibold whitespace-nowrap overflow-hidden">
                        <div className="bg-white text-black p-1 rounded-md shrink-0">
                            <Calendar size={16} />
                        </div>
                        2BookUrMeetings
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ffffff0a] transition-colors text-sm font-medium text-gray-300 hover:text-white">
                        <Calendar size={18} />
                        Event Types
                    </Link>
                    <Link href="/dashboard/availability" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ffffff0a] transition-colors text-sm font-medium text-gray-300 hover:text-white">
                        <Clock size={18} />
                        Availability
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ffffff0a] transition-colors text-sm font-medium text-gray-300 hover:text-white">
                        <Settings size={18} />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#ffffff10]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={session.user.image || ""} alt="Avatar" className="w-8 h-8 rounded-full border border-[#ffffff20]" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-white truncate">{session.user.name}</span>
                        </div>
                    </div>
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#ef444420] hover:text-danger-color transition-colors text-sm font-medium text-gray-400 mt-2">
                        <LogOut size={18} />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8 animate-fade-in">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
