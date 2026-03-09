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

                <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">

                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                        Stand: März 2026
                    </p>

                    {/* 1. Anbieter */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">1. Anbieter</h2>
                        <p className="mb-4">
                            Anbieter des Dienstes „2BookUrMeetings" ist:
                        </p>
                        <p className="mb-4">
                            Merlin Mechler<br />
                            Hirzerweg 8<br />
                            12107 Berlin<br />
                            E-Mail: <a href="mailto:merlin@merlinmechler.de" className="underline">merlin@merlinmechler.de</a>
                        </p>
                    </section>

                    {/* 2. Geltungsbereich */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">2. Geltungsbereich</h2>
                        <p className="mb-4">
                            Diese Nutzungsbedingungen gelten für alle Nutzer der webbasierten Anwendung „2BookUrMeetings" (nachfolgend „Dienst"). Es wird zwischen zwei Nutzergruppen unterschieden:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li><strong>Creators:</strong> Personen, die sich mit einem Google-Account registrieren und Terminbuchungsseiten erstellen</li>
                            <li><strong>Besucher:</strong> Personen, die über eine öffentliche Buchungsseite einen Termin buchen</li>
                        </ul>
                        <p className="mb-4">
                            Durch die Nutzung des Dienstes erklären Sie sich mit diesen Nutzungsbedingungen einverstanden. Abweichende Bedingungen des Nutzers werden nicht anerkannt.
                        </p>
                    </section>

                    {/* 3. Leistungsbeschreibung */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">3. Leistungsbeschreibung</h2>
                        <p className="mb-4">
                            2BookUrMeetings ist eine Open-Source-Terminbuchungsplattform. Der Dienst ermöglicht es Creators:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Termintypen mit individuellen Einstellungen zu erstellen</li>
                            <li>Verfügbarkeiten zu konfigurieren</li>
                            <li>Buchungsseiten öffentlich zu teilen</li>
                            <li>Buchungen mit dem Google Kalender zu synchronisieren</li>
                            <li>Buchungsbenachrichtigungen via Webhook zu empfangen</li>
                        </ul>
                        <p className="mb-4">
                            Der Dienst wird kostenlos und ohne Gewährleistung für eine bestimmte Verfügbarkeit bereitgestellt. Ein Anspruch auf ununterbrochene Nutzbarkeit besteht nicht.
                        </p>
                    </section>

                    {/* 4. Registrierung & Google-Verknüpfung */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">4. Registrierung & Google-Konto-Verknüpfung</h2>
                        <p className="mb-4">
                            Die Nutzung als Creator setzt einen gültigen Google-Account voraus. Mit dem Login erteilen Sie der App Zugriff auf Ihren Google Kalender (Lesen und Schreiben), um Buchungen synchronisieren zu können.
                        </p>
                        <p className="mb-4">
                            Der Creator ist dafür verantwortlich:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Seinen Account vor unbefugtem Zugriff zu schützen</li>
                            <li>Den Google-Kalender-Zugriff bei Nichtnutzung unter <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline">myaccount.google.com/permissions</a> zu widerrufen</li>
                            <li>Die in der App geteilten Buchungslinks verantwortungsvoll weiterzugeben</li>
                        </ul>
                    </section>

                    {/* 5. Pflichten der Nutzer */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">5. Pflichten der Nutzer</h2>
                        <p className="mb-4">Die Nutzung des Dienstes ist ausschließlich für legale Zwecke gestattet. Untersagt ist insbesondere:</p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Die missbräuchliche oder automatisierte Nutzung der Buchungsfunktion (Spam-Buchungen)</li>
                            <li>Die Angabe falscher Kontaktdaten bei Buchungen</li>
                            <li>Versuche, die Sicherheit oder Verfügbarkeit des Dienstes zu beeinträchtigen</li>
                            <li>Die Nutzung des Dienstes für illegale oder diskriminierende Zwecke</li>
                        </ul>
                        <p className="mb-4">
                            Bei Verstößen behält sich der Anbieter vor, den Zugang zum Dienst ohne Vorankündigung zu sperren.
                        </p>
                    </section>

                    {/* 6. Verfügbarkeit */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">6. Verfügbarkeit</h2>
                        <p className="mb-4">
                            Der Anbieter bemüht sich um eine hohe Verfügbarkeit des Dienstes, übernimmt jedoch keine Garantie. Wartungsarbeiten, technische Störungen sowie Ausfälle bei Drittanbietern (insbesondere Vercel, Google) können die Verfügbarkeit einschränken. Ein Anspruch auf Schadensersatz wegen Nichtverfügbarkeit besteht nicht.
                        </p>
                    </section>

                    {/* 7. Haftungsbeschränkung */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">7. Haftungsbeschränkung</h2>
                        <p className="mb-4">
                            Der Anbieter haftet nicht für:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Schäden durch Ausfall oder Fehlfunktion des Dienstes</li>
                            <li>Fehlerhafte oder doppelte Buchungen infolge von API-Problemen bei Google</li>
                            <li>Datenverluste, sofern diese nicht auf grober Fahrlässigkeit oder Vorsatz des Anbieters beruhen</li>
                            <li>Inhalte, die Creator auf ihrer Buchungsseite veröffentlichen</li>
                            <li>Schäden durch missbräuchliche Nutzung durch Dritte</li>
                        </ul>
                        <p className="mb-4">
                            Die Haftung für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie für grobe Fahrlässigkeit und Vorsatz bleibt unberührt.
                        </p>
                    </section>

                    {/* 8. Kündigung */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">8. Kündigung & Accountlöschung</h2>
                        <p className="mb-4">
                            Creator können ihr Konto jederzeit durch eine E-Mail an <a href="mailto:merlin@merlinmechler.de" className="underline">merlin@merlinmechler.de</a> löschen lassen. Nach Löschung werden alle gespeicherten Daten (Termintypen, Buchungen, Account-Informationen) unwiderruflich entfernt.
                        </p>
                        <p className="mb-4">
                            Der Anbieter behält sich vor, Accounts bei Verstößen gegen diese Nutzungsbedingungen ohne Ankündigung zu sperren oder zu löschen.
                        </p>
                    </section>

                    {/* 9. Änderungen */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">9. Änderungen der Nutzungsbedingungen</h2>
                        <p className="mb-4">
                            Der Anbieter behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern. Wesentliche Änderungen werden auf dieser Seite veröffentlicht. Die fortgesetzte Nutzung des Dienstes nach einer Änderung gilt als Zustimmung zu den neuen Bedingungen.
                        </p>
                    </section>

                    {/* 10. Anwendbares Recht */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">10. Anwendbares Recht & Gerichtsstand</h2>
                        <p className="mb-4">
                            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, soweit gesetzlich zulässig.
                        </p>
                        <p className="mb-4">
                            Für Verbraucher innerhalb der EU gilt: Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="underline">ec.europa.eu/consumers/odr</a>. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
