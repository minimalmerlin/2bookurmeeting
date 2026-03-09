import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { title, description, duration, slug, customQuestions } = body;

        // Validate inputs
        if (!title || !duration || !slug) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check slug uniqueness for this user
        const existing = await prisma.eventType.findUnique({
            where: {
                userId_slug: { userId: session.user.id, slug }
            }
        });

        if (existing) {
            return new NextResponse("Slug already exists for this user", { status: 400 });
        }

        const eventType = await prisma.eventType.create({
            data: {
                title,
                description,
                duration: parseInt(duration),
                slug,
                customQuestions,
                userId: session.user.id
            }
        });

        return NextResponse.json(eventType);
    } catch (error) {
        console.error("[EVENT_TYPES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
