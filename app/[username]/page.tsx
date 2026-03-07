import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";

type Props = {
    params: Promise<{
        username: string;
    }>;
};

export default async function PublicProfilePage({ params }: Props) {
    const { username } = await params;

    const user = await prisma.user.findUnique({
        where: { username },
        include: { eventTypes: true }
    });

    if (!user) {
        return notFound();
    }

    return (
        <main className="min-h-screen py-20 px-4 bg-[#0f172a] relative overflow-hidden flex flex-col items-center">
            {/* Background decoration elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-color/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-accent-color/10 blur-[120px] pointer-events-none"></div>

            <div className="max-w-3xl w-full z-10 animate-fade-in">
                <div className="text-center mb-12">
                    {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={user.name || "User"} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-[#ffffff10] shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-[#ffffff10] flex items-center justify-center mx-auto mb-6 border-4 border-[#ffffff10]">
                            <span className="text-3xl font-bold text-white">{user.name?.charAt(0) || user.username?.charAt(0)}</span>
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-gray-400">Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.</p>
                </div>

                {user.eventTypes.length === 0 ? (
                    <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-[#ffffff10]">
                        <Calendar size={32} className="text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No event types available</h3>
                        <p className="text-gray-400">This user hasn't set up any public event types yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {user.eventTypes.map((eventType: any) => (
                            <Link key={eventType.id} href={`/${username}/${eventType.slug}`} className="glass-panel p-6 flex items-center justify-between group hover:border-[#6366f150] hover:bg-[#ffffff05] transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary-color/20 text-primary-color flex items-center justify-center group-hover:bg-primary-color group-hover:text-white transition-colors">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1">{eventType.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Clock size={14} />
                                            {eventType.duration} min
                                        </div>
                                    </div>
                                </div>

                                <div className="w-10 h-10 rounded-full border border-[#ffffff10] flex items-center justify-center group-hover:border-primary-color text-gray-500 group-hover:text-primary-color transition-colors group-hover:-translate-x-1">
                                    <ArrowRight size={18} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
