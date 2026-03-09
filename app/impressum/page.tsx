import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white pb-24">
            <div className="max-w-3xl mx-auto px-6 pt-16">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-12">
                    <ArrowLeft size={16} /> Zurück zur Startseite
                </Link>

                <h1 className="text-4xl font-bold mb-8 tracking-tight">Impressum</h1>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Angaben gemäß § 5 TMG.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Seitenbetreiber</h2>
                    <p>
                        Merlin Mechler<br />
                        Hirzerweg 8<br />
                        12107 Berlin
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Kontakt</h2>
                    <p>
                        E-Mail: merlin@merlinmechler.de<br />
                        Telefon: 0177 8197928
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                    <p>
                        Merlin Mechler<br />
                        Hirzerweg 8<br />
                        12107 Berlin
                    </p>

                    <h2 className="text-xl font-semibold mt-10 mb-4">Haftung für Inhalte</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </p>
                </div>
            </div>
        </div>
    );
}
