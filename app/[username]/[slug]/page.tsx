import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { Clock, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    params: Promise<{
        username: string;
        slug: string;
    }>;
};

export default async function BookingPage({ params }: Props) {
    const { username, slug } = await params;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) return notFound();

    const eventType = await prisma.eventType.findUnique({
        where: { userId_slug: { userId: user.id, slug } },
    });

    if (!eventType) return notFound();

    return (
        <main className="min-h-screen py-10 px-4 flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
            {/* Background decoration elements */}
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-primary-color/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent-color/10 blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl w-full z-10 glass-panel md:flex min-h-[600px] animate-fade-in shadow-2xl border border-[#ffffff10] rounded-2xl overflow-hidden">

                {/* Left Side: Event Details */}
                <div className="md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-[#ffffff10] bg-[#ffffff02]">
                    <Link href={`/${username}`} className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Link>

                    <div className="mb-8">
                        <p className="text-gray-400 font-medium mb-2">{user.name}</p>
                        <h1 className="text-3xl font-bold text-white mb-6 leading-tight">{eventType.title}</h1>

                        <div className="space-y-4">
                            <div className="flex items-center text-gray-300 font-medium gap-3">
                                <Clock className="text-primary-color" size={20} />
                                {eventType.duration} min
                            </div>
                            <div className="flex text-gray-300 font-medium gap-3">
                                <CalendarIcon className="text-primary-color shrink-0 mt-0.5" size={20} />
                                Web conferencing details provided upon confirmation.
                            </div>
                        </div>
                    </div>

                    {eventType.description && (
                        <div className="text-gray-400 leading-relaxed text-sm pt-6 border-t border-[#ffffff10]">
                            {eventType.description}
                        </div>
                    )}
                </div>

                {/* Right Side: Booking Form Container */}
                <div className="md:w-2/3 p-8 bg-[#ffffff02] relative">
                    <BookingForm eventType={eventType} user={user} />
                </div>

            </div>
        </main>
    );
}
