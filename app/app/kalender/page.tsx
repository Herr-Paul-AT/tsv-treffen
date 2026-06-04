import Link from 'next/link';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Icon } from '@/components/ui/Icon';
import { getTrainingsInRange } from '@/lib/db/queries/trainings';
import { listEventsInRange } from '@/lib/db/queries/events';
import { formatTimeRange, WEEKDAYS_DE_SHORT, MONTHS_DE } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Filter = 'all' | 'training' | 'match' | 'event';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'training', label: 'Training' },
  { id: 'match', label: 'Match' },
  { id: 'event', label: 'Events' },
];

const HOURS = [14, 15, 16, 17, 18, 19, 20, 21];

type Block = {
  href: string;
  startHour: number;
  durationH: number;
  label: string;
  tone: 'forest' | 'lake' | 'sand';
  timeLabel: string;
};

function isoWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  const day = (out.getDay() + 6) % 7; // make Monday=0
  out.setDate(out.getDate() - day);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfWeek(d: Date): Date {
  const out = startOfWeek(d);
  out.setDate(out.getDate() + 7);
  return out;
}

function parseDayParam(value?: string): Date {
  if (!value) return new Date();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default async function KalenderPage({
  searchParams,
}: {
  searchParams?: Promise<{ day?: string; filter?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const filter = (FILTERS.find((f) => f.id === sp.filter)?.id ?? 'all') as Filter;
  const selected = parseDayParam(sp.day);
  const weekStart = startOfWeek(selected);
  const weekEnd = endOfWeek(selected);

  const [trainings, events] = await Promise.all([
    getTrainingsInRange(weekStart, weekEnd),
    listEventsInRange(weekStart, weekEnd),
  ]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const blocks: Block[] = [];
  for (const t of trainings) {
    if (!sameDay(t.startsAt, selected)) continue;
    if (filter !== 'all' && filter !== 'training') continue;
    const start = t.startsAt.getHours() + t.startsAt.getMinutes() / 60;
    const end = t.endsAt.getHours() + t.endsAt.getMinutes() / 60;
    blocks.push({
      href: `/app/trainings/${t.id}`,
      startHour: start,
      durationH: Math.max(0.5, end - start),
      label: t.title,
      tone: 'forest',
      timeLabel: formatTimeRange(t.startsAt, t.endsAt),
    });
  }
  for (const e of events) {
    if (!sameDay(e.startsAt, selected)) continue;
    if (filter !== 'all') {
      if (filter === 'match' && e.kind !== 'match') continue;
      if (filter === 'event' && e.kind !== 'event' && e.kind !== 'tournament') continue;
    }
    const start = e.startsAt.getHours() + e.startsAt.getMinutes() / 60;
    const end = e.endsAt
      ? e.endsAt.getHours() + e.endsAt.getMinutes() / 60
      : start + 2;
    blocks.push({
      href: '#',
      startHour: start,
      durationH: Math.max(1, end - start),
      label: e.title,
      tone: e.kind === 'match' ? 'lake' : 'sand',
      timeLabel: `${String(e.startsAt.getHours()).padStart(2, '0')}:${String(e.startsAt.getMinutes()).padStart(2, '0')}`,
    });
  }

  const weekListItems = [
    ...trainings.map((t) => ({
      href: `/app/trainings/${t.id}`,
      title: t.title,
      when: t.startsAt,
      tone: 'forest' as const,
      time: formatTimeRange(t.startsAt, t.endsAt),
    })),
    ...events.map((e) => ({
      href: '#',
      title: e.title,
      when: e.startsAt,
      tone: (e.kind === 'match' ? 'lake' : 'sand') as 'lake' | 'sand',
      time: `${String(e.startsAt.getHours()).padStart(2, '0')}:${String(e.startsAt.getMinutes()).padStart(2, '0')}`,
    })),
  ]
    .filter((x) => x.when >= new Date())
    .sort((a, b) => a.when.getTime() - b.when.getTime())
    .slice(0, 6);

  const TONE_BG = {
    forest: 'bg-forest-50 border-forest-200 text-forest-800',
    lake: 'bg-lake-50 border-lake-200 text-lake-800',
    sand: 'bg-sand-50 border-sand-200 text-sand-800',
  } as const;

  const TONE_STRIPE = {
    forest: 'bg-forest-500',
    lake: 'bg-lake-500',
    sand: 'bg-sand-500',
  } as const;

  const week = isoWeek(weekStart);
  const monthName = MONTHS_DE[selected.getMonth()];

  return (
    <>
      <MobileHeader
        lead={`KW ${week} · ${monthName} ${selected.getFullYear()}`}
        title="Kalender"
        action={
          <button
            type="button"
            aria-label="Neuer Termin"
            className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"
          >
            <Icon.Plus size={18} />
          </button>
        }
      />

      <div className="px-5">
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto -mx-1 px-1">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            const href = `/app/kalender?day=${isoDate(selected)}${f.id === 'all' ? '' : `&filter=${f.id}`}`;
            return (
              <Link
                key={f.id}
                href={href}
                className={[
                  'px-3 h-9 inline-flex items-center rounded-full text-[13px] font-medium border whitespace-nowrap',
                  active
                    ? 'bg-stone-800 text-paper-50 border-stone-800'
                    : 'bg-white text-stone-700 border-stone-200',
                ].join(' ')}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <div className="bg-white rounded-lg border border-stone-200 px-2 py-3 grid grid-cols-7 gap-0.5">
          {days.map((d, i) => {
            const active = sameDay(d, selected);
            const href = `/app/kalender?day=${isoDate(d)}${filter === 'all' ? '' : `&filter=${filter}`}`;
            return (
              <Link
                key={i}
                href={href}
                className={[
                  'flex flex-col items-center gap-1 py-2 rounded-md',
                  active ? 'bg-lake-700 text-paper-50' : 'text-stone-700 hover:bg-stone-50',
                ].join(' ')}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                    active ? 'text-paper-100/70' : 'text-stone-500'
                  }`}
                >
                  {WEEKDAYS_DE_SHORT[d.getDay()]}
                </span>
                <span className="font-display text-[20px] leading-none">{d.getDate()}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-4 pb-8">
        <div className="relative bg-white rounded-lg border border-stone-200">
          {HOURS.map((h) => (
            <div key={h} className="grid grid-cols-[48px_1fr] border-t first:border-t-0 border-stone-100">
              <div className="font-mono text-[11px] text-stone-400 pt-1.5 pl-3 uppercase tracking-[0.12em]">
                {h}:00
              </div>
              <div className="h-14 relative">
                {blocks
                  .filter((b) => Math.floor(b.startHour) === h)
                  .map((b, j) => {
                    const heightPx = b.durationH * 56 - 8;
                    return (
                      <Link
                        key={j}
                        href={b.href}
                        className={`absolute left-2 right-3 top-1 rounded-md border px-3 py-2 ${TONE_BG[b.tone]}`}
                        style={{ height: `${heightPx}px` }}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
                          {b.timeLabel}
                        </div>
                        <div className="text-[14px] font-medium leading-tight mt-0.5">{b.label}</div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="px-5 py-6 text-center text-[14px] text-stone-500">
              Nichts geplant für diesen Tag.
            </div>
          )}
        </div>

        <div className="mt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2">
            Diese Woche
          </h3>
          <div className="space-y-2">
            {weekListItems.length === 0 && (
              <div className="text-[14px] text-stone-500">Nichts mehr in dieser Woche.</div>
            )}
            {weekListItems.map((b, i) => (
              <Link
                key={i}
                href={b.href}
                className="bg-white rounded-md border border-stone-200 p-3 flex items-center gap-3"
              >
                <div className={`w-1 h-10 rounded-full ${TONE_STRIPE[b.tone]}`} />
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-stone-800 leading-tight">{b.title}</div>
                  <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-1">
                    {WEEKDAYS_DE_SHORT[b.when.getDay()]} · {b.time}
                  </div>
                </div>
                <Icon.ChevronRight size={16} className="text-stone-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
