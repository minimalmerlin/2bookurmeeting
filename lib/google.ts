import { google } from "googleapis";
import { prisma } from "./prisma";

export async function getGoogleCalendarClient(userId: string) {
    // Find the Google account linked to this user
    const account = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: "google",
        },
    });

    if (!account || !account.access_token) {
        throw new Error("Google account not found or not connected properly.");
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expiry_date: account.expires_at ? account.expires_at * 1000 : null,
    });

    // Automatically handle token refresh & save new token to DB
    oauth2Client.on("tokens", async (tokens) => {
        if (tokens.refresh_token || tokens.access_token) {
            await prisma.account.update({
                where: { provider_providerAccountId: { provider: "google", providerAccountId: account.providerAccountId } },
                data: {
                    access_token: tokens.access_token ?? account.access_token,
                    refresh_token: tokens.refresh_token ?? account.refresh_token,
                    expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : account.expires_at,
                },
            });
        }
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    return calendar;
}
