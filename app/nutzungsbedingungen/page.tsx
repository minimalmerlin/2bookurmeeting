import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Nutzungsbedingungen() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white pb-24">
            <div className="max-w-3xl mx-auto px-6 pt-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12">
                    <ArrowLeft size={16} /> Zurück zur Startseite
                </Link>

                <h1 className="text-4xl font-bold mb-8 tracking-tight">Nutzungsbedingungen (AGB)</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                    <p className="mb-8">
                        Letzte Aktualisierung: {new Date().toLocaleDateString("de-DE")}
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4 text-black dark:text-white">1. Geltungsbereich</h2>
                    <p className="mb-4">
                        Diese Nutzungsbedingungen gelten für alle Nutzer der webbasierten Anwendung "2BookUrMeetings" (nachfolgend "Dienst"). Durch die Nutzung des Dienstes erklären Sie sich mit diesen Bedingungen einverstanden.
                    </p>

                    <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">2. Leistungsbeschreibung</h2>
                    <p className="mb-4">
                        2BookUrMeetings ist eine Open-Source Terminbuchungssoftware. Der Betreiber stellt die technische Plattform zur Verfügung, übernimmt jedoch keine Garantie für die ständige Verfügbarkeit des Dienstes. Dieser Dienst wird "as-is" ohne ausdrückliche Garantien bereitgestellt.
                    </p>

                    <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">3. Google Account Verknüpfung</h2>
                    <p className="mb-4">
                        Um Termine anbieten zu können, muss der Nutzer seinen Google-Account verknüpfen. Der Nutzer ist dafür verantwortlich, diese Verbindung zu widerrufen (über die Google Security Settings), sollte er den Dienst nicht mehr in Anspruch nehmen wollen.
                    </p>

                    <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">4. Haftungsbeschränkung</h2>
                    <p className="mb-4">
                        Der Betreiber haftet nicht für direkte oder indirekte Schäden, die durch den Ausfall der Server, fehlerhafte Buchungen, API-Rate-Limits von Drittanbietern (z.B. Google) oder Datenverluste entstehen, es sei denn, diese beruhen auf grober Fahrlässigkeit oder Vorsatz des Betreibers.
                    </p>
                </div>
            </div>
        </div>
    );
}
