import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { username } = body;

        if (!username) {
            return new NextResponse("Username missing", { status: 400 });
        }

        // Ensure alphanumeric and dashes only
        const validUsername = /^[a-zA-Z0-9-]+$/.test(username);
        if (!validUsername) {
            return new NextResponse("Invalid username format. Only alphanumeric and dashes allowed.", { status: 400 });
        }

        // Check if username is taken globally
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing && existing.id !== session.user.id) {
            return new NextResponse("Username already taken", { status: 400 });
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: { username }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
