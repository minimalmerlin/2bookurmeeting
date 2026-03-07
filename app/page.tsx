"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-color/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-color/20 blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-sm font-medium text-primary-color border-primary-color/30">
          <Calendar size={16} />
          <span>The modern scheduling experience</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
          Scheduling infrastructure for everyone.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect your Google Calendar, setup your event types, and let people book time with you seamlessly. Beautiful, fast, and completely yours.
        </p>

        {status === "loading" ? (
          <div className="w-12 h-12 rounded-full border-4 border-[#ffffff10] border-t-primary-color animate-spin mx-auto"></div>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn-primary text-lg px-8 py-4 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            Sign In with Google
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </main>
  );
}
