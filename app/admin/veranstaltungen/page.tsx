import Link from 'next/link';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listAllEvents } from '@/lib/db/queries/events';
import type { Event } from '@/lib/db/schema';
import { MONTHS_DE } from '@/lib/format';

export const dynamic = 'force-dynamic';

const KIND_LABEL: Record<Event['kind'], string> = {
  tournament: 'Turnier',
  event: 'Veranstaltung',
  match: 'Match',
  training: 'Training',
};

const KIND_TONE: Record<Event['kind'], BadgeTone> = {
  tournament: 'sand',
  event: 'forest',
  match: 'lake',
  training: 'neutral',
};

function formatWhen(e: Event): string {
  const d = e.startsAt;
  const datePart = `${String(d.getDate()).padStart(2, '0')}. ${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`;
  if (e.allDay) return `${datePart} · ganztägig`;
  const pad = (n: number) => String(n).padStart(2, '0');
  let timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (e.endsAt) timePart += `–${pad(e.endsAt.getHours())}:${pad(e.endsAt.getMinutes())}`;
  return `${datePart} · ${timePart}`;
}

export default async function AdminEventsPage() {
  const all = await listAllEvents();
  const now = new Date();
  const upcoming = all.filter((e) => (e.endsAt ?? e.startsAt) >= now);
  const past = all.filter((e) => (e.endsAt ?? e.startsAt) < now);

  const STATS = [
    { l: 'Gesamt', v: String(all.length), s: 'Termine erfasst', tone: 'text-lake-700' },
    { l: 'Kommend', v: String(upcoming.length), s: 'noch geplant', tone: 'text-forest-700' },
    {
      l: 'Turniere',
      v: String(all.filter((e) => e.kind === 'tournament').length),
      s: 'in der Saison',
      tone: 'text-sand-700',
    },
    { l: 'Vergangen', v: String(past.length), s: 'im Archiv', tone: 'text-stone-500' },
  ];

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Planung
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Veranstaltungen &amp; Turniere
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
            Turniere, Treffen, Wettkämpfe und Vereinstermine zentral verwalten. Neue Termine
            erscheinen automatisch im Kalender, auf dem Dashboard und der Startseite.
          </p>
        </div>
        <Link href="/admin/veranstaltungen/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Veranstaltung anlegen
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
            <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{t.v}</div>
            <div className={`mt-2 text-[13px] font-medium ${t.tone}`}>{t.s}</div>
          </div>
        ))}
      </div>

      <EventTable title="Kommende Termine" rows={upcoming} emptyHint="Keine kommenden Termine geplant." />
      {past.length > 0 && <EventTable title="Vergangen" rows={past} muted />}
    </main>
  );
}

function EventTable({
  title,
  rows,
  emptyHint,
  muted = false,
}: {
  title: string;
  rows: Event[];
  emptyHint?: string;
  muted?: boolean;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-[22px] text-stone-800">{title}</h2>
      <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-[200px_minmax(220px,1fr)_130px_180px_44px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
          <span>Wann</span>
          <span>Titel</span>
          <span>Art</span>
          <span>Ort</span>
          <span />
        </div>
        {rows.length === 0 && (
          <div className="px-5 py-8 text-center text-[14px] text-stone-500">{emptyHint}</div>
        )}
        {rows.map((e, i) => (
          <Link
            key={e.id}
            href={`/admin/veranstaltungen/${e.id}`}
            className={[
              'grid grid-cols-[200px_minmax(220px,1fr)_130px_180px_44px] gap-3 px-5 py-3.5 items-center',
              i % 2 ? '' : 'bg-paper-50/40',
              'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
              muted ? 'opacity-70' : '',
            ].join(' ')}
          >
            <span className="font-mono text-[12px] text-stone-600">{formatWhen(e)}</span>
            <span className="text-[14.5px] font-medium text-stone-800 truncate">{e.title}</span>
            <span>
              <Badge tone={KIND_TONE[e.kind]}>{KIND_LABEL[e.kind]}</Badge>
            </span>
            <span className="text-[13.5px] text-stone-600 truncate">{e.location ?? '—'}</span>
            <span className="text-stone-400 inline-flex justify-end">
              <Icon.Edit size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
