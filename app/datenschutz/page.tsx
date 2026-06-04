import Link from 'next/link';
import { TSVLockup } from '@/components/brand/Logo';

export const metadata = { title: 'Datenschutz · TSV Schloss Treffen' };

export default function DatenschutzPage() {
  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12">
        <Link href="/" className="inline-block">
          <TSVLockup height={36} />
        </Link>
        <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow">
          Rechtliches
        </div>
        <h1 className="font-display text-[40px] leading-[1.05] text-stone-800 mt-3">
          Datenschutzerklärung
        </h1>
        <p className="text-[16px] text-stone-600 mt-3 leading-[1.65]">
          Diese Erklärung informiert dich gemäß DSGVO (Verordnung (EU) 2016/679) und österreichischem
          Datenschutzgesetz darüber, wie wir personenbezogene Daten im Rahmen der Vereinsplattform
          verarbeiten.
        </p>

        <section className="mt-10 bg-white rounded-lg border border-stone-200 p-6 sm:p-8 space-y-6 text-[15px] text-stone-700 leading-[1.65]">
          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">
              Verantwortlicher
            </h2>
            <p>
              TSV Schloss Treffen, Schlossweg 1, 9521 Treffen am Ossiachersee. Kontakt:{' '}
              <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
                office@tsv-treffen.at
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">
              Welche Daten wir verarbeiten
            </h2>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Stammdaten: Name, Adresse, Geburtsdatum, E-Mail, Telefon</li>
              <li>Mitgliedschaft: Mannschaft, Funktion, Beitritts- und ggf. Austrittsdatum</li>
              <li>Sportbezogene Daten: LK-Wertung, Anwesenheiten, Spiel- und Trainingsteilnahmen</li>
              <li>Finanzdaten: Mitgliedsbeitrag-Status, Bankverbindung für SEPA-Lastschrift</li>
              <li>Technische Daten beim App-Login: Session-Token, Logzeitpunkt, User-Agent</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Zweck</h2>
            <p>
              Mitgliederverwaltung, Sportbetrieb (Trainings, Spiele, Anwesenheit), Kommunikation
              innerhalb des Vereins, Beitragsabrechnung, Erfüllung gesetzlicher Aufzeichnungspflichten.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Rechtsgrundlagen</h2>
            <p>
              Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) im Rahmen der Mitgliedschaft, rechtliche
              Verpflichtung (lit. c) für Buchhaltung und Vereinsregister, berechtigtes Interesse
              (lit. f) für Sicherheit und IT-Betrieb, sowie deine Einwilligung (lit. a) für
              optionale Funktionen wie Newsletter und Push-Benachrichtigungen.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">
              Empfänger &amp; Auftragsverarbeiter
            </h2>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                eTennis (externer Platzbuchungs-Dienstleister) — Vor- und Nachname sowie
                Vereinszugehörigkeit zur SSO-Authentifizierung
              </li>
              <li>Hosting-Provider innerhalb der EU für App und Datenbank</li>
              <li>Kärntner Tennisverband — sportbezogene Pflichtmeldungen (z. B. LK-Wertung)</li>
              <li>Steuerberatung — ausschließlich aggregierte Buchungsdaten</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Speicherdauer</h2>
            <p>
              Mitgliedsdaten werden während der Mitgliedschaft sowie bis zu 7 Jahre danach für
              steuerliche Aufbewahrungspflichten gespeichert. Sportbezogene Statistiken werden nach
              Austritt anonymisiert oder gelöscht.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Deine Rechte</h2>
            <p>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
              Verarbeitung, Datenübertragbarkeit und Widerspruch. Anfragen richte bitte an{' '}
              <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
                office@tsv-treffen.at
              </a>
              . Beschwerden kannst du außerdem bei der österreichischen Datenschutzbehörde
              einbringen.
            </p>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500 pt-4 border-t border-stone-100">
            Stand: Mai 2026
          </div>
        </section>

        <div className="mt-10 flex items-center justify-between">
          <Link href="/" className="text-[14px] text-lake-700 font-medium">
            ← Zurück zur Startseite
          </Link>
          <Link href="/impressum" className="text-[14px] text-lake-700 font-medium">
            Impressum →
          </Link>
        </div>
      </div>
    </main>
  );
}
