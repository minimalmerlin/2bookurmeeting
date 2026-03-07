import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";

type Props = {
    params: Promise<{
        username: string;
        slug: string;
    }>;
};

export default async function EmbedBookingPage({ params }: Props) {
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
        <div className="bg-[#0f172a] min-h-screen text-white font-sans p-6 rounded-xl border border-[#ffffff10] shadow-2xl overflow-hidden">
            <div className="mb-8 border-b border-[#ffffff10] pb-6">
                <p className="text-gray-400 font-medium mb-1">{user.name}</p>
                <h1 className="text-2xl font-bold text-white mb-2">{eventType.title}</h1>
                <p className="text-sm text-gray-300">{eventType.duration} minutes • Powered by CalendlyClone</p>
            </div>
            <BookingForm eventType={eventType} user={user} />
        </div>
    );
}
