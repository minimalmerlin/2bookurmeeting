import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { username, webhookUrl } = body;

        if (!username) {
            return new NextResponse("Username missing", { status: 400 });
        }

        // Ensure alphanumeric and dashes only, min 3 chars, max 30
        const validUsername = /^[a-zA-Z0-9-]+$/.test(username);
        if (!validUsername || username.length < 3 || username.length > 30) {
            return new NextResponse("Invalid username format. Only alphanumeric and dashes allowed (3-30 chars).", { status: 400 });
        }

        // Block reserved route names
        const reserved = ["dashboard", "api", "auth", "admin", "impressum", "datenschutz", "nutzungsbedingungen", "embed", "settings", "login", "logout", "register"];
        if (reserved.includes(username.toLowerCase())) {
            return new NextResponse("This username is reserved and cannot be used.", { status: 400 });
        }

        // Check if username is taken globally
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing && existing.id !== session.user.id) {
            return new NextResponse("Username already taken", { status: 400 });
        }

        // Validate webhook URL if provided
        let finalWebhookUrl = webhookUrl;
        if (finalWebhookUrl) {
            try {
                const parsed = new URL(finalWebhookUrl);
                if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                    throw new Error("Invalid protocol");
                }
            } catch {
                return new NextResponse("Invalid webhook URL. Must be a valid http or https URL.", { status: 400 });
            }
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                username,
                webhookUrl: finalWebhookUrl || null
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[SETTINGS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
