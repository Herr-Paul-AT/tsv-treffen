import { TSVMark } from '@/components/brand/Logo';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type CourtTone = 'forest' | 'sand' | 'danger';
type Court = { n: string; state: string; tone: CourtTone; next: string };

const COURTS: Court[] = [
  { n: '1', state: 'frei', tone: 'forest', next: 'Frei bis 18:00' },
  { n: '2', state: 'frei', tone: 'forest', next: 'Frei bis 17:30' },
  { n: '3', state: 'belegt', tone: 'danger', next: 'Belegt bis 16:00' },
  { n: '4', state: 'wenig', tone: 'sand', next: 'Nur 17:30–19:00' },
];

const DOT: Record<CourtTone, string> = {
  forest: 'bg-forest-500',
  sand: 'bg-sand-500',
  danger: 'bg-danger',
};
const STATE_TEXT: Record<CourtTone, string> = {
  forest: 'text-forest-700',
  sand: 'text-sand-700',
  danger: 'text-danger',
};

export default function PlatzbuchungPage() {
  return (
    <>
      <MobileHeader title="Platzbuchung" lead="Heute · 14:02" />
      <div className="px-5 pb-8">
        {/* Stat row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-md border border-stone-200 p-3.5">
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
              Offene Slots
            </div>
            <div className="font-display text-[28px] text-stone-800 mt-1 leading-none">14</div>
            <div className="font-mono text-[10.5px] text-forest-700 uppercase tracking-[0.14em] mt-1">
              Heute · alle Plätze
            </div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3.5">
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
              Deine Buchungen
            </div>
            <div className="font-display text-[28px] text-stone-800 mt-1 leading-none">2</div>
            <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">
              Mi 17:00, Sa 09:00
            </div>
          </div>
        </div>

        {/* Court grid */}
        <h3 className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.18em] mt-7">
          Aktuelle Belegung
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {COURTS.map((c) => (
            <div
              key={c.n}
              className="bg-white rounded-lg border border-stone-200 p-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">
                  Sandplatz
                </div>
                <span className={`w-2 h-2 rounded-full ${DOT[c.tone]}`} />
              </div>
              <div className="font-display text-[44px] text-stone-800 leading-none mt-1.5">
                {c.n}
              </div>
              <div className={`mt-2 text-[12px] font-medium ${STATE_TEXT[c.tone]}`}>
                {c.state}
              </div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">
                {c.next}
              </div>
            </div>
          ))}
        </div>

        {/* External booking */}
        <div className="mt-7 bg-stone-800 text-paper-50 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <TSVMark size={140} variant="negative" />
          </div>
          <div className="relative">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
              Slot reservieren
            </div>
            <h3 className="font-display text-[22px] mt-2 leading-[1.15]">
              Buchung läuft über eTennis.
            </h3>
            <p className="text-[14px] text-paper-100/80 mt-2 leading-[1.5]">
              Wir leiten dich mit deinem Vereinslogin direkt zum Buchungssystem — kein zweites
              Konto, keine Eingabe nochmal.
            </p>
            <a
              href="https://www.etennis.at"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4"
            >
              <Button
                variant="accent"
                size="lg"
                iconAfter={<Icon.External size={16} />}
                className="w-full"
              >
                Zu eTennis öffnen
              </Button>
            </a>
            <div className="mt-3 font-mono text-[10.5px] text-paper-100/60 uppercase tracking-[0.14em] flex items-center gap-2">
              <Icon.Info size={12} /> Storno bis 4 h vorher kostenfrei
            </div>
          </div>
        </div>

        {/* Mini regeln */}
        <div className="mt-4 bg-white rounded-md border border-stone-200 p-4">
          <h4 className="font-display text-[18px] text-stone-800">Regeln · Kurz</h4>
          <ul className="mt-2 space-y-1.5 text-[14px] text-stone-600">
            <li className="flex gap-2">
              <span className="text-sand-700">·</span> Max. 2 offene Buchungen pro Mitglied
            </li>
            <li className="flex gap-2">
              <span className="text-sand-700">·</span> Standardblock 90 Minuten
            </li>
            <li className="flex gap-2">
              <span className="text-sand-700">·</span> Bei Regen Halle 3 in Villach reserviert
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
