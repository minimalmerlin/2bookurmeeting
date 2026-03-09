import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    return (
        <div className="max-w-2xl space-y-8 animate-fade-in mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-gray-400">Manage your public profile and connection settings.</p>
            </div>

            <div className="glass-panel p-8">
                <h3 className="text-xl font-semibold text-white mb-6 pb-4 border-b border-[#ffffff10]">General Settings</h3>
                <SettingsForm initialUsername={user?.username || ""} initialWebhookUrl={user?.webhookUrl || ""} />
            </div>

            <div className="glass-panel p-8">
                <h3 className="text-xl font-semibold text-white mb-6 pb-4 border-b border-[#ffffff10]">Integrations</h3>
                <div className="flex items-center justify-between p-4 bg-[#ffffff05] rounded-lg border border-[#ffffff10]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-white">Google Calendar</p>
                            <p className="text-sm text-gray-400">Connected to check conflicts and add events.</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-color/20 text-success-color border border-success-color/30">
                        Connected
                    </span>
                </div>
            </div>
        </div>
    );
}
