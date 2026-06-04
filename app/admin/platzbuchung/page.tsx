import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { StatusDot, type StatusDotTone } from '@/components/ui/StatusDot';

type Booking = {
  time: string;
  duration: string;
  court: string;
  who: string;
  initials: string;
  type: 'Mitglied' | 'Gast' | 'Mannschaft';
};

const TODAY: Booking[] = [
  { time: '14:00', duration: '90 min', court: 'Platz 1', who: 'Martin Hofmann', initials: 'MH', type: 'Mitglied' },
  { time: '15:30', duration: '60 min', court: 'Platz 2', who: 'Katharina Wallner', initials: 'KW', type: 'Mitglied' },
  { time: '16:00', duration: '120 min', court: 'Platz 1 & 2', who: 'Mannschaft Herren II', initials: 'MP', type: 'Mannschaft' },
  { time: '17:30', duration: '90 min', court: 'Platz 3', who: 'Familie Brunner', initials: 'AB', type: 'Mitglied' },
  { time: '18:00', duration: '60 min', court: 'Platz 4', who: 'Gast · L. Rauter', initials: 'LR', type: 'Gast' },
  { time: '19:00', duration: '90 min', court: 'Platz 1', who: 'Julian Steiner', initials: 'JS', type: 'Mitglied' },
];

const COURTS: { n: string; pct: number; tone: StatusDotTone; label: string }[] = [
  { n: '1', pct: 72, tone: 'forest', label: 'Heute · 72 % belegt' },
  { n: '2', pct: 60, tone: 'forest', label: 'Heute · 60 % belegt' },
  { n: '3', pct: 88, tone: 'sand', label: 'Heute · 88 % belegt' },
  { n: '4', pct: 45, tone: 'forest', label: 'Heute · 45 % belegt' },
];

const TYPE_TONE = { Mitglied: 'lake', Gast: 'sand', Mannschaft: 'forest' } as const;

export default function AdminBookingsPage() {
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · eTennis-Sync
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Platzbuchung
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-forest-700 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-forest-500" /> Sync OK · vor 2 Min
          </span>
          <a
            href="https://www.etennis.at"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" iconAfter={<Icon.External size={14} />}>
              eTennis öffnen
            </Button>
          </a>
        </div>
      </div>

      {/* Court utilization */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {COURTS.map((c) => (
          <div key={c.n} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
                Sandplatz
              </div>
              <span className="font-display text-[24px] text-stone-800 leading-none">{c.n}</span>
            </div>
            <div className="mt-4">
              <div className="h-2 rounded-full bg-paper-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    c.tone === 'forest' ? 'bg-forest-500' : c.tone === 'sand' ? 'bg-sand-500' : 'bg-danger'
                  }`}
                  style={{ width: `${c.pct}%` }}
                />
              </div>
              <div className="mt-2 font-display text-[28px] text-stone-800 leading-none">
                {c.pct}%
              </div>
            </div>
            <div className="mt-3">
              <StatusDot tone={c.tone} label={c.label} />
            </div>
          </div>
        ))}
      </div>

      {/* Today's bookings */}
      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <section className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-baseline justify-between">
            <h2 className="font-display text-[20px] text-stone-800">Buchungen heute</h2>
            <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
              {TODAY.length} Einträge
            </span>
          </div>
          {TODAY.map((b, i) => (
            <div
              key={`${b.time}-${b.court}`}
              className={[
                'grid grid-cols-[80px_minmax(140px,1fr)_120px_120px_40px] gap-3 px-5 py-3.5 items-center',
                i % 2 ? '' : 'bg-paper-50/40',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50',
              ].join(' ')}
            >
              <div>
                <div className="font-display text-[18px] text-stone-800 leading-none">
                  {b.time}
                </div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">
                  {b.duration}
                </div>
              </div>
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar initials={b.initials} size={32} tone="lake" />
                <span className="text-[14px] text-stone-800 truncate">{b.who}</span>
              </div>
              <span className="text-[13.5px] text-stone-700">{b.court}</span>
              <Badge tone={TYPE_TONE[b.type]}>{b.type}</Badge>
              <button
                type="button"
                aria-label="Weitere Aktionen"
                className="text-stone-400 hover:text-stone-700 w-8 h-8 rounded-md inline-flex items-center justify-center hover:bg-stone-100"
              >
                <Icon.More size={16} />
              </button>
            </div>
          ))}
        </section>

        <aside className="space-y-4">
          <div className="bg-stone-800 text-paper-50 rounded-xl p-5">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
              eTennis-Sync
            </div>
            <h3 className="font-display text-[20px] mt-2 leading-tight">
              Datenquelle ist eTennis.
            </h3>
            <p className="text-[13.5px] text-paper-100/75 mt-2 leading-[1.55]">
              Buchungen werden nicht hier vorgenommen. Diese Ansicht spiegelt den aktuellen Stand
              read-only und aktualisiert sich alle 5 Minuten.
            </p>
            <a
              href="https://www.etennis.at"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4"
            >
              <Button variant="accent" size="md" iconAfter={<Icon.External size={14} />} className="w-full">
                Zu eTennis
              </Button>
            </a>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h3 className="font-display text-[18px] text-stone-800">Heute</h3>
            <div className="mt-3 space-y-2 text-[13.5px] text-stone-600">
              <div className="flex justify-between">
                <span>Buchungen gesamt</span>
                <span className="font-medium text-stone-800">{TODAY.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Mannschaftsblöcke</span>
                <span className="font-medium text-stone-800">1</span>
              </div>
              <div className="flex justify-between">
                <span>Gastbuchungen</span>
                <span className="font-medium text-stone-800">1</span>
              </div>
              <div className="flex justify-between">
                <span>Auslastung Ø</span>
                <span className="font-medium text-stone-800">66 %</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
