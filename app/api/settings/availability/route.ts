import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { hours } = body;

        if (!Array.isArray(hours)) {
            return new NextResponse("Invalid payload", { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { workingHours: JSON.stringify(hours) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[AVAILABILITY_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
