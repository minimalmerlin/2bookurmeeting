import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AvailabilityForm } from "@/components/AvailabilityForm";

export default async function AvailabilityPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { workingHours: true },
    });

    if (!user) return redirect("/");

    const defaultHours = JSON.stringify([
        { day: 1, start: "09:00", end: "17:00" },
        { day: 2, start: "09:00", end: "17:00" },
        { day: 3, start: "09:00", end: "17:00" },
        { day: 4, start: "09:00", end: "17:00" },
        { day: 5, start: "09:00", end: "17:00" }
    ]);

    const workingHours = user.workingHours || defaultHours;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Availability</h1>
                <p className="text-gray-400">Manage your weekly working hours when you accept meetings.</p>
            </div>

            <div className="glass-panel p-6">
                <AvailabilityForm initialHours={JSON.parse(workingHours)} />
            </div>
        </div>
    );
}
