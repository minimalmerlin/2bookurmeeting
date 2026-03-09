import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white pb-24">
            <div className="max-w-3xl mx-auto px-6 pt-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12">
                    <ArrowLeft size={16} /> Zurück zur Startseite
                </Link>

                <h1 className="text-4xl font-bold mb-8 tracking-tight">Datenschutzerklärung</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
                    <h2 className="text-xl font-semibold mt-8 mb-4 text-black dark:text-white">1. Datenschutz auf einen Blick</h2>
                    <h3 className="text-lg font-medium mt-6 mb-3 text-black dark:text-white">Allgemeine Hinweise</h3>
                    <p className="mb-4">
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                    </p>

                    <h3 className="text-lg font-medium mt-6 mb-3 text-black dark:text-white">Datenerfassung auf unserer Website</h3>
                    <p className="mb-4"><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

                    <p className="mb-4"><strong>Wie erfassen wir Ihre Daten?</strong><br />
                        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie im Buchungsformular eingeben oder die durch den Google-Login übermittelt werden (Name, E-Mail).</p>

                    <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">2. Google Calendar Integration & OAuth</h2>
                    <p className="mb-4">
                        Unsere App 2BookUrMeetings nutzt die Google Calendar API, um Termine zu synchronisieren. Wenn Sie sich als Creator einloggen, erbitten wir Zugriff auf Ihren primären Google Kalender, um Terminkonflikte auszuschließen und neue Buchungen eintragen zu können. Es werden keine sonstigen Google Drive Dateien oder E-Mails gelesen. Alle Zugangs-Token werden sicher in unserer Datenbank verwahrt.
                    </p>

                    <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">3. Hosting</h2>
                    <p className="mb-4">
                        Unsere Website wird bei Vercel gehostet (Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, USA). Die Vercel Postgres Datenbank ist auf Serverstandorte in der Europäischen Union (z.B. Frankfurt, EU-Central) konfiguriert, um eine DSGVO-konforme Datenhaltung zu gewährleisten. Zum Einsatz dieses Anbieters haben wir (bzw. können wir) einen Vertrag zur Auftragsverarbeitung (AVV) abschließen.
                    </p>
                </div>
            </div>
        </div>
    );
}
