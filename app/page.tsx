"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calendar, ArrowRight, CheckCircle2, Sparkles, Filter, ShieldCheck, Link as LinkIcon, Check, X } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-gray-200">
      {/* Notion-style Clean Header */}
      <header className="w-full max-w-6xl mx-auto p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity cursor-pointer">
          <div className="bg-black text-white p-1.5 rounded-md dark:bg-white dark:text-black">
            <Calendar size={18} />
          </div>
          <span className="tracking-tight">2BookUrMeetings</span>
        </div>

        {status === "unauthenticated" && (
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-sm font-medium px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black hover:scale-105 rounded-lg transition-transform shadow-md"
          >
            Google Login
          </button>
        )}
        {status === "authenticated" && (
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md transition-colors dark:hover:bg-gray-800"
          >
            Dashboard
          </button>
        )}
      </header>

      {/* Hero Section: Apple/Notion Hybrid */}
      <section className="w-full flex-1 flex flex-col items-center pt-24 pb-16 px-6 z-10 animate-fade-in max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-8 text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm">
          <Sparkles size={16} className="text-amber-500" />
          Speziell für Solo-Freelancer & Creator
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-balance leading-[1.1]">
          Der kostenlose, Open-Source Termin-Link <br className="hidden md:block" />
          <span className="text-gray-400">mit smarter Vorqualifizierung.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
          Teile einen Link, lass andere Termine buchen – ohne Limits, ohne Paywall und mit automatischer Formular-Logik, die unqualifizierte Anfragen stoppt.
        </p>

        {status === "loading" ? (
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin dark:border-gray-700 dark:border-t-white mx-auto"></div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black hover:scale-95 transition-transform duration-200 text-base font-medium px-8 py-4 rounded-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl"
            >
              Kostenlose Booking-Page erstellen
              <ArrowRight size={18} />
            </button>
            <a
              href="#comparison"
              className="w-full sm:w-auto px-8 py-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg font-medium transition-colors text-base border border-gray-200 dark:border-gray-700"
            >
              Warum nicht Calendly?
            </a>
          </div>
        )}
        <div className="text-sm text-gray-400 mt-6 flex items-center justify-center gap-2 font-medium">
          <CheckCircle2 size={16} className="text-green-500" /> 100% Kostenlos
          <div className="w-1 h-1 rounded-full bg-gray-300 mx-1"></div>
          Zero Tracking
          <div className="w-1 h-1 rounded-full bg-gray-300 mx-1"></div>
          Self-Hostbar (DSGVO-konform)
        </div>
      </section>

      {/* Visual Flow Matrix - 3 Steps */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">In 2 Minuten eingerichtet</h2>
          <p className="text-lg text-gray-500">Ein supereinfacher Setup-Wizard ohne Enterprise-Bloatware.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">1</div>
            <h3 className="text-xl font-bold mb-3">Google verbinden</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Sicherer 1-Klick OAuth Login. Wir lesen/schreiben ausschließlich in deinem Google Calendar, um Doppelbuchungen zu verhindern.</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">2</div>
            <h3 className="text-xl font-bold mb-3">Zeiten & Fragen definieren</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Erstelle unlimitierte Event-Typen und füge spezifische Qualifizierungsfragen hinzu (z.B. Budget, Ziele), um deine Pipeline zu filtern.</p>
          </div>
          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 relative overflow-hidden group">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">3</div>
            <h3 className="text-xl font-bold mb-3">Link teilen</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Ein Master-Link für deine Bio, Website oder E-Mail-Signatur. Mobile-First UX für eine extrem reibungslose Kundenerfahrung.</p>
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section className="w-full bg-gray-50 dark:bg-[#0a0a0a] py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Differenzierung, die zählt.</h2>
            <p className="text-xl text-gray-500 leading-relaxed">Vergiss überladene Enterprise-Tools. Wir konzentrieren uns auf genau das, was Creator und Einzelkämpfer wirklich brauchen, um Zeit zu sparen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center justify-center mb-6">
                <Filter size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Stoppt unqualifizierte Calls</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Richte Pflichtfragen wie „Was ist dein Budget?“ oder „Wer hat dich empfohlen?“ ein. Filtere ungeeignete Leads aus deinem Kalender, bevor sie deine Zeit stehlen.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Google-Only Integration</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Super lean und extrem zuverlässig. Wir überschreiben keine Kalenderregeln, sondern bauen 100% auf dem auf, was Google Calendar vorgibt, inkl. automatischen Meet-Links.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Tech & Trust (OSS)</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Open Source. Kein 3rd-Party Tracking, keine invasiven Cookies. Hoste es selbst auf einem deutschen Server (z.B. Hetzner) für 100% DSGVO-Konformität, oder nutze Vercel für den schnellen Start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Warum nicht Calendly oder Cal.com?</h2>
          <p className="text-lg text-gray-500">Wir bauen keine Enterprise-Plattform. Wir bauen das perfekte Tool für Solopreneure, bei dem du nicht für Basics bezahlen musst.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="pb-6 pt-4 px-6 border-b-2 border-gray-200 dark:border-gray-800 text-gray-400 font-medium uppercase text-xs w-1/4">Feature</th>
                <th className="pb-6 pt-4 px-6 border-b-2 border-black dark:border-white w-1/4 text-center">
                  <div className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black py-1 px-3 rounded-md mb-2">
                    <Calendar size={14} /> 2BookUrMeetings
                  </div>
                  <div className="text-xs font-normal text-gray-500">(Dein Tool)</div>
                </th>
                <th className="pb-6 pt-4 px-6 border-b-2 border-gray-200 dark:border-gray-800 w-1/4 text-center">
                  <div className="font-bold text-lg mb-2 text-gray-600 dark:text-gray-300">Calendly Free</div>
                  <div className="text-xs font-normal text-gray-500">Industry Giant</div>
                </th>
                <th className="pb-6 pt-4 px-6 border-b-2 border-gray-200 dark:border-gray-800 w-1/4 text-center">
                  <div className="font-bold text-lg mb-2 text-gray-600 dark:text-gray-300">Cal.com</div>
                  <div className="text-xs font-normal text-gray-500">Generisches OSS Tool</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-6 px-6 font-medium">Zielgruppe</td>
                <td className="py-6 px-6 text-center font-bold text-black dark:text-white bg-gray-50 dark:bg-white/5">Solo-Creator & Freelancer</td>
                <td className="py-6 px-6 text-center text-gray-500">Generisch (Sales, HR)</td>
                <td className="py-6 px-6 text-center text-gray-500">Devs, Infrastruktur, Teams</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-6 px-6 font-medium">Preis</td>
                <td className="py-6 px-6 text-center font-bold text-green-600 dark:text-green-400 bg-gray-50 dark:bg-white/5">Kostenlos (Open Source)</td>
                <td className="py-6 px-6 text-center text-gray-500">Free stark limitiert (~$10/m)</td>
                <td className="py-6 px-6 text-center text-gray-500">OSS, aber Paid Limits ($15/m)</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-6 px-6 font-medium">Event-Typ Limits</td>
                <td className="py-6 px-6 text-center font-bold text-black dark:text-white bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-500" /> Unlimitiert</div>
                </td>
                <td className="py-6 px-6 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2 text-red-500"><X size={16} /> Nur 1 Event-Typ</div>
                </td>
                <td className="py-6 px-6 text-center text-gray-500">Unlimitiert</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="py-6 px-6 font-medium">Qualifizierungslogik</td>
                <td className="py-6 px-6 text-center font-bold text-black dark:text-white bg-gray-50 dark:bg-white/5">Eingebaut, Event-spezifisch</td>
                <td className="py-6 px-6 text-center text-gray-500">Nur simple Textfelder (Free)</td>
                <td className="py-6 px-6 text-center text-gray-500">Komplex, via Apps</td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800">
                <td className="py-6 px-6 font-medium">Social / Bio Optimiert</td>
                <td className="py-6 px-6 text-center font-bold text-black dark:text-white bg-gray-50 dark:bg-white/5">
                  <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-500" /> Perfekt für Link-in-Bio</div>
                </td>
                <td className="py-6 px-6 text-center text-gray-500">Vorrangig Desktop-Fokus</td>
                <td className="py-6 px-6 text-center text-gray-500">Generisch, B2B-Fokus</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Trust/Final CTA */}
      <section className="w-full bg-black text-white py-24 px-6 text-center mt-auto border-t border-gray-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Drop one link in your bio.</h2>
          <p className="text-gray-400 mb-10 text-lg">Und blocke nie wieder einen Call, der deine Zeit nicht wert ist.</p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="bg-white text-black hover:scale-95 transition-transform duration-200 text-base font-medium px-8 py-4 rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.2)] inline-flex items-center justify-center"
          >
            Mit Google Authentication starten
          </button>
          <div className="mt-8 text-sm text-gray-500 flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Setup in 2 Min.</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Kostenlos hosten</span>
            <span className="flex items-center gap-2"><LinkIcon size={14} /> Github Repository</span>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-12 text-center text-sm text-gray-600 dark:text-gray-500 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} 2BookUrMeetings — Built for Solo-Entrepreneurs.</p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="hover:text-black dark:hover:text-white transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-black dark:hover:text-white transition-colors">Datenschutz</Link>
            <Link href="/nutzungsbedingungen" className="hover:text-black dark:hover:text-white transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
