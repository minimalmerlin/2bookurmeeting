"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calendar, ArrowRight, Video, Clock, CheckCircle2, CalendarCheck } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-gray-200">
      {/* Notion-style Clean Header */}
      <header className="w-full max-w-5xl mx-auto p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity cursor-pointer">
          <div className="bg-black text-white p-1 rounded-md dark:bg-white dark:text-black">
            <Calendar size={18} />
          </div>
          <span className="tracking-tight">2BookUrMeetings</span>
        </div>

        {status === "unauthenticated" && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md transition-colors dark:hover:bg-gray-800"
          >
            Log in
          </button>
        )}
      </header>

      {/* Hero Section: Apple/Notion Hybrid */}
      <section className="w-full flex-1 flex flex-col items-center pt-24 pb-16 px-6 z-10 animate-fade-in max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mb-8 text-sm font-medium border border-gray-200 dark:border-gray-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Version 2.0 is live
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-balance leading-[1.1]">
          Your schedule, <br className="hidden md:block" />
          <span className="text-gray-400">beautifully booked.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
          A scheduling tool so simple it feels like magic. Connect your Google Calendar, set your hours, and share your link. No friction, just meetings.
        </p>

        {status === "loading" ? (
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin dark:border-gray-700 dark:border-t-white mx-auto"></div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black hover:scale-95 transition-transform duration-200 text-base font-medium px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Get started for free
              <ArrowRight size={18} />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg font-medium transition-colors text-base"
            >
              See how it works
            </a>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">Free forever. No credit card required.</p>
      </section>

      {/* Product Image Mockup (Apple Style) */}
      <section className="w-full max-w-5xl mx-auto px-6 mb-32 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="w-full rounded-2xl bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 p-2 sm:p-4 shadow-2xl">
          <div className="w-full bg-white dark:bg-black rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-[16/10] sm:aspect-video flex flex-col">
            {/* Fake Browser Header */}
            <div className="h-10 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-2 bg-gray-50 dark:bg-[#111]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4 bg-white dark:bg-black rounded border border-gray-200 dark:border-gray-700 h-6 flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-medium font-mono">2bookurmeetings.vercel.app/merlin</span>
              </div>
            </div>
            {/* Fake App Content  */}
            <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white dark:from-black to-transparent z-10 pointer-events-none"></div>

              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl">👨‍💻</div>
                <div>
                  <h3 className="font-semibold text-xl">Merlin Mechler</h3>
                  <p className="text-gray-500 text-sm">Welcome to my scheduling page.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl relative z-0">
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#111] shadow-sm flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Quick Sync</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">15 min</p>
                  </div>
                  <ChevronRightIcon className="text-gray-300" />
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#111] shadow-sm flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Deep Work Call</h4>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">60 min</p>
                  </div>
                  <ChevronRightIcon className="text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (Notion block style) */}
      <section id="how-it-works" className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need. <br className="sm:hidden" /><span className="text-gray-400">Nothing you don't.</span></h2>
          <p className="text-xl text-gray-500">We cut the bloat so you can focus on the meeting, not the setup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Block 1 */}
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6 shadow-sm">
              <CalendarCheck size={20} className="text-black dark:text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Google Native</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Deeply integrated with Google Calendar. We check your conflicts in real-time. No double bookings.
            </p>
          </div>

          {/* Feature Block 2 */}
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6 shadow-sm">
              <Video size={20} className="text-black dark:text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Auto-Meet Links</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Every booking automatically generates a secure Google Meet link and attaches it to the calendar invite.
            </p>
          </div>

          {/* Feature Block 3 */}
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800">
            <div className="w-10 h-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center mb-6 shadow-sm">
              <Clock size={20} className="text-black dark:text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Total Control</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Set your exact working hours. Decide exactly when you are available, day by day.
            </p>
          </div>
        </div>
      </section>

      {/* Trust/Final CTA */}
      <section className="w-full bg-black text-white py-24 px-6 text-center mt-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to simplify your scheduling?</h2>
          <p className="text-gray-400 mb-10 text-lg">Join today and get your personal booking link in seconds.</p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="bg-white text-black hover:scale-95 transition-transform duration-200 text-base font-medium px-8 py-4 rounded-lg shadow-lg inline-flex items-center justify-center"
          >
            Continue with Google
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-8 text-center text-sm text-gray-400 bg-black">
        <p>© {new Date().getFullYear()} 2BookUrMeetings.</p>
      </footer>
    </main>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
