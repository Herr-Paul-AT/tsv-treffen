import Link from 'next/link';
import { TSVLockup } from '@/components/brand/Logo';

export const metadata = { title: 'Impressum · TSV Schloss Treffen' };

export default function ImpressumPage() {
  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12">
        <Link href="/" className="inline-block">
          <TSVLockup height={36} />
        </Link>
        <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 rule-eyebrow">
          Rechtliches
        </div>
        <h1 className="font-display text-[40px] leading-[1.05] text-stone-800 mt-3">Impressum</h1>
        <p className="text-[16px] text-stone-600 mt-3 leading-[1.65]">
          Angaben gemäß § 5 ECG (E-Commerce-Gesetz Österreich) und § 24 Mediengesetz.
        </p>

        <section className="mt-10 bg-white rounded-lg border border-stone-200 p-6 sm:p-8 space-y-6 text-[15px] text-stone-700 leading-[1.65]">
          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Medieninhaber</h2>
            <p>
              TSV Schloss Treffen
              <br />
              Schlossweg 1<br />
              9521 Treffen am Ossiachersee
              <br />
              Österreich
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Kontakt</h2>
            <p>
              Telefon: +43 4248 0000
              <br />
              E-Mail:{' '}
              <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
                office@tsv-treffen.at
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Vertretungsbefugt</h2>
            <p>
              Obmann: Martin Hofmann
              <br />
              Schriftführerin: Katharina Wallner
              <br />
              Kassier: Markus Pirker
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">Vereinsregister</h2>
            <p>
              ZVR-Zahl: 000000000
              <br />
              Vereinsbehörde: Bezirkshauptmannschaft Villach-Land
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">
              Unternehmensgegenstand
            </h2>
            <p>
              Förderung und Ausübung des Tennissports in der Marktgemeinde Treffen am Ossiachersee
              und Umgebung.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[20px] text-stone-800 mb-2">
              Online-Streitbeilegung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lake-700"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500 pt-4 border-t border-stone-100">
            Stand: Mai 2026
          </div>
        </section>

        <div className="mt-10">
          <Link href="/" className="text-[14px] text-lake-700 font-medium">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
