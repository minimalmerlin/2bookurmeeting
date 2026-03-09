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

                <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-6">

                    {/* 1. Verantwortlicher */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">1. Verantwortlicher</h2>
                        <p className="mb-4">
                            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
                        </p>
                        <p className="mb-4">
                            Merlin Mechler<br />
                            Hirzerweg 8<br />
                            12107 Berlin<br />
                            E-Mail: <a href="mailto:merlin@merlinmechler.de" className="underline">merlin@merlinmechler.de</a><br />
                            Telefon: 0177 8197928
                        </p>
                    </section>

                    {/* 2. Überblick */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">2. Datenschutz auf einen Blick</h2>
                        <p className="mb-4">
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen oder nutzen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen finden Sie in den nachfolgenden Abschnitten.
                        </p>
                    </section>

                    {/* 3. Welche Daten wir erheben */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">3. Welche Daten wir verarbeiten</h2>

                        <h3 className="text-lg font-medium mt-6 mb-3 text-black dark:text-white">a) Bei der Nutzung als Creator (eingeloggter Nutzer)</h3>
                        <p className="mb-4">
                            Wenn Sie sich über Google OAuth einloggen, erhalten wir folgende Daten von Google:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Name und E-Mail-Adresse</li>
                            <li>Profilbild (Google Avatar)</li>
                            <li>OAuth-Token (Access Token &amp; Refresh Token für die Google Calendar API)</li>
                        </ul>
                        <p className="mb-4">
                            Diese Daten werden in unserer Datenbank gespeichert, um Ihnen den Zugang zum Dashboard und die Kalender-Synchronisation zu ermöglichen.
                        </p>
                        <p className="mb-4">
                            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) – die Verarbeitung ist zur Bereitstellung des Dienstes erforderlich.
                        </p>

                        <h3 className="text-lg font-medium mt-6 mb-3 text-black dark:text-white">b) Bei der Buchung eines Termins (Besucher)</h3>
                        <p className="mb-4">
                            Wenn Sie über eine öffentliche Buchungsseite einen Termin buchen, werden folgende Daten erhoben:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li>Name und E-Mail-Adresse</li>
                            <li>Gewünschter Termin (Datum und Uhrzeit)</li>
                            <li>Antworten auf individuelle Qualifizierungsfragen (sofern vom Seitenbetreiber konfiguriert)</li>
                        </ul>
                        <p className="mb-4">
                            Diese Daten werden in unserer Datenbank gespeichert und in Ihren Google Kalender eingetragen. Sie erhalten eine Buchungsbestätigung mit einem Google Meet-Link.
                        </p>
                        <p className="mb-4">
                            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) – die Verarbeitung ist zur Durchführung des gebuchten Termins erforderlich.
                        </p>

                        <h3 className="text-lg font-medium mt-6 mb-3 text-black dark:text-white">c) Server-Logfiles</h3>
                        <p className="mb-4">
                            Beim Aufruf unserer Website werden automatisch technische Zugriffsdaten vom Hosting-Anbieter (Vercel) erfasst, darunter IP-Adresse, Browsertyp, Betriebssystem und Zugriffszeit. Diese Daten dienen der technischen Stabilität des Dienstes und werden nicht zur Identifizierung von Personen verwendet.
                        </p>
                        <p className="mb-4">
                            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren Betrieb).
                        </p>
                    </section>

                    {/* 4. Google Calendar & OAuth */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">4. Google Calendar API & Google OAuth</h2>
                        <p className="mb-4">
                            Diese App verwendet die Google Calendar API sowie Google OAuth 2.0. Wenn Sie sich als Creator einloggen, erbitten wir folgende Berechtigungen:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li><strong>Kalender lesen:</strong> Um Ihre bestehenden Termine zu prüfen und Doppelbuchungen zu vermeiden</li>
                            <li><strong>Kalender schreiben:</strong> Um neue Buchungen als Kalendereinträge mit Google Meet-Link einzutragen</li>
                        </ul>
                        <p className="mb-4">
                            Es werden keine E-Mails, Google Drive-Dateien oder sonstigen Google-Daten gelesen oder verarbeitet. Die Nutzung der Google-Daten beschränkt sich ausschließlich auf die genannten Kalenderfunktionen.
                        </p>
                        <p className="mb-4">
                            Google ist dabei als Auftragsverarbeiter gemäß Art. 28 DSGVO tätig. Weitere Informationen zum Datenschutz bei Google finden Sie unter: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">policies.google.com/privacy</a>
                        </p>
                        <p className="mb-4">
                            Sie können die erteilten Zugriffsberechtigungen jederzeit unter <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="underline">myaccount.google.com/permissions</a> widerrufen.
                        </p>
                    </section>

                    {/* 5. Hosting */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">5. Hosting & Infrastruktur</h2>
                        <p className="mb-4">
                            Die Website wird bei <strong>Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Die Datenbank (Vercel Postgres) ist auf Serverstandorte in der Europäischen Union (Frankfurt, EU-Central) konfiguriert.
                        </p>
                        <p className="mb-4">
                            Für die Datenübertragung in die USA gilt: Vercel ist nach dem EU-U.S. Data Privacy Framework zertifiziert und bietet damit ein angemessenes Schutzniveau gemäß Art. 45 DSGVO. Zusätzlich haben wir mit Vercel einen Vertrag zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO geschlossen.
                        </p>
                    </section>

                    {/* 6. Speicherdauer */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">6. Speicherdauer</h2>
                        <p className="mb-4">
                            Ihre Daten werden gespeichert, solange es für den jeweiligen Zweck erforderlich ist oder Sie Ihren Account nicht löschen:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li><strong>Account-Daten (Creator):</strong> Bis zur Löschung des Accounts</li>
                            <li><strong>Buchungsdaten:</strong> Bis zur Löschung durch den Creator oder auf Anfrage des Besuchers</li>
                            <li><strong>Server-Logs:</strong> In der Regel 7–30 Tage (gemäß Vercel-Richtlinien)</li>
                        </ul>
                    </section>

                    {/* 7. Weitergabe */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">7. Weitergabe von Daten</h2>
                        <p className="mb-4">
                            Ihre Daten werden nicht an Dritte verkauft. Eine Weitergabe erfolgt nur in folgenden Fällen:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li><strong>Google:</strong> Im Rahmen der Calendar API (siehe Abschnitt 4)</li>
                            <li><strong>Vercel:</strong> Als Hosting-Anbieter (siehe Abschnitt 5)</li>
                            <li><strong>Webhook-Empfänger:</strong> Falls der Creator eine Webhook-URL konfiguriert hat, werden Buchungsdaten an diese URL übermittelt (liegt im Verantwortungsbereich des Creators)</li>
                        </ul>
                    </section>

                    {/* 8. Betroffenenrechte */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">8. Ihre Rechte</h2>
                        <p className="mb-4">Sie haben gemäß DSGVO folgende Rechte:</p>
                        <ul className="list-disc list-inside mb-4 space-y-1">
                            <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über Sie gespeichert haben</li>
                            <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten</li>
                            <li><strong>Löschung</strong> (Art. 17 DSGVO): Löschung Ihrer Daten („Recht auf Vergessenwerden")</li>
                            <li><strong>Einschränkung</strong> (Art. 18 DSGVO): Einschränkung der Verarbeitung</li>
                            <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Herausgabe Ihrer Daten in maschinenlesbarem Format</li>
                            <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen die Verarbeitung auf Basis berechtigter Interessen</li>
                        </ul>
                        <p className="mb-4">
                            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:merlin@merlinmechler.de" className="underline">merlin@merlinmechler.de</a>
                        </p>
                        <p className="mb-4">
                            Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Die zuständige Behörde in Berlin ist die <strong>Berliner Beauftragte für Datenschutz und Informationsfreiheit</strong>.
                        </p>
                    </section>

                    {/* 9. Cookies */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">9. Cookies & Sessions</h2>
                        <p className="mb-4">
                            Diese Website verwendet ausschließlich technisch notwendige Cookies für die Sitzungsverwaltung (NextAuth.js Session-Cookie). Es werden keine Tracking-, Marketing- oder Analyse-Cookies eingesetzt. Eine Einwilligung ist hierfür nicht erforderlich (Art. 6 Abs. 1 lit. f DSGVO).
                        </p>
                    </section>

                    {/* 10. Änderungen */}
                    <section>
                        <h2 className="text-xl font-semibold mt-10 mb-4 text-black dark:text-white">10. Änderungen dieser Datenschutzerklärung</h2>
                        <p className="mb-4">
                            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf dieser Seite abrufbar.
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
                            Stand: März 2026
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
