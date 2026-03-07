"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calendar, ArrowRight, Video, Clock, Globe, CalendarCheck } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#0f172a] overflow-x-hidden">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-20 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Calendar className="text-primary-color" />
          2BookUrMeetings
        </div>

        {status === "unauthenticated" && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium text-white hover:text-primary-color transition-colors"
          >
            Login
          </button>
        )}
      </header>

      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-color/20 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-color/20 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="w-full flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 z-10 animate-fade-in relative min-h-screen">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-sm font-medium text-primary-color border-primary-color/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-color opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-color"></span>
            </span>
            New: Google Meet Integration Available
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 pb-2">
            Booking meetings, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-color to-accent-color">simplified.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The ultimate scheduling infrastructure. Connect your Google Calendar, set your working hours, and let clients book you seamlessly.
          </p>

          {status === "loading" ? (
            <div className="w-12 h-12 rounded-full border-4 border-[#ffffff10] border-t-primary-color animate-spin mx-auto"></div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full sm:w-auto btn-primary text-lg px-8 py-4 shadow-[0_0_40px_rgba(99,102,241,0.4)] group"
              >
                Get Started for Free
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-[#ffffff0a] hover:bg-[#ffffff15] border border-[#ffffff10] text-white rounded-xl font-medium transition-all"
              >
                View Features
              </a>
            </div>
          )}
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="mt-20 w-full max-w-5xl relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent z-10 pointer-events-none h-full w-full"></div>
          <div className="glass-panel border-t border-[#ffffff20] border-l border-r rounded-t-2xl shadow-2xl overflow-hidden pt-4 px-4 bg-[#ffffff05]">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="h-64 sm:h-96 w-full rounded-t-xl bg-[#ffffff05] border border-[#ffffff10] p-4 flex gap-4">
              <div className="w-1/4 h-full rounded-lg bg-[#ffffff05] hidden sm:block"></div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="w-1/3 h-8 rounded-lg bg-[#ffffff10]"></div>
                <div className="flex gap-4">
                  <div className="flex-1 h-32 rounded-xl bg-[#ffffff05] border border-[#ffffff10]"></div>
                  <div className="flex-1 h-32 rounded-xl bg-[#ffffff05] border border-[#ffffff10]"></div>
                  <div className="flex-1 h-32 rounded-xl bg-[#ffffff05] border border-[#ffffff10] hidden xl:block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-7xl mx-auto py-24 px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for Professionals</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to manage your time and book meetings flawlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-panel p-8 rounded-2xl border-[#ffffff10] hover:border-primary-color/50 transition-colors group">
            <div className="w-14 h-14 rounded-xl bg-primary-color/10 flex items-center justify-center text-primary-color mb-6 group-hover:scale-110 transition-transform">
              <CalendarCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Google Calendar Sync</h3>
            <p className="text-gray-400 leading-relaxed">
              Never be double-booked again. We automatically check your Google Calendar for conflicts and busy times before rendering your booking slots.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-8 rounded-2xl border-[#ffffff10] hover:border-accent-color/50 transition-colors group">
            <div className="w-14 h-14 rounded-xl bg-accent-color/10 flex items-center justify-center text-accent-color mb-6 group-hover:scale-110 transition-transform">
              <Video size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Google Meet Integrations</h3>
            <p className="text-gray-400 leading-relaxed">
              Automatically generate and attach secure Google Meet video conference links to every successful booking without any manual effort.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-8 rounded-2xl border-[#ffffff10] hover:border-success-color/50 transition-colors group">
            <div className="w-14 h-14 rounded-xl bg-success-color/10 flex items-center justify-center text-success-color mb-6 group-hover:scale-110 transition-transform">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Custom Availability</h3>
            <p className="text-gray-400 leading-relaxed">
              Take control of your schedule. Define your exact working hours for every day of the week right from your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-[#ffffff03] py-24 relative z-10 border-t border-b border-[#ffffff0a]">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Embed anywhere. <br /><span className="text-primary-color">Share everywhere.</span></h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-color/20 text-primary-color flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Create your event types</h4>
                    <p className="text-gray-400">Set durations, descriptions, and custom URLs for different meeting purposes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-color/20 text-primary-color flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Share your link</h4>
                    <p className="text-gray-400">Send clients your unique link or embed the booking widget directly on your personal website using our iframe snippet.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-color/20 text-primary-color flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">Watch your calendar fill up</h4>
                    <p className="text-gray-400">Meetings are instantly added to your Google Calendar, and invites are sent automatically.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="glass-panel p-8 rounded-2xl relative border-primary-color/30 shadow-[0_0_50px_rgba(99,102,241,0.15)]">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="text-primary-color" />
                  <span className="text-white font-medium">Your Personal Page</span>
                </div>
                <div className="space-y-4">
                  <div className="h-16 bg-[#ffffff0a] rounded-xl border border-[#ffffff10] flex items-center px-4">
                    <div className="w-10 h-10 rounded-full bg-[#ffffff10] mr-4"></div>
                    <div className="w-32 h-4 bg-[#ffffff10] rounded"></div>
                  </div>
                  <div className="h-16 bg-[#ffffff0a] rounded-xl border border-[#ffffff10] flex items-center px-4">
                    <div className="w-10 h-10 rounded-full bg-[#ffffff10] mr-4"></div>
                    <div className="w-40 h-4 bg-[#ffffff10] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm z-10">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Calendar size={16} />
          <span>© {new Date().getFullYear()} 2BookUrMeetings. Built for productivity.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </main>
  );
}
