import Link from 'next/link';
import { TerminCard } from '@/components/cards/TerminCard';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { getTrainingsInRange, listTrainingsForManagement } from '@/lib/db/queries/trainings';
import { listEventsInRange } from '@/lib/db/queries/events';
import {
  getTrainingAdminStats,
  getMembersNeedingAttention,
} from '@/lib/db/queries/admin-trainings';
import { MONTHS_DE } from '@/lib/format';

export const dynamic = 'force-dynamic';

function startOfWeek(d: Date) {
  const out = new Date(d);
  const day = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - day);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfWeek(d: Date) {
  const out = startOfWeek(d);
  out.setDate(out.getDate() + 7);
  return out;
}

export default async function AdminTrainingsPage() {
  const now = new Date();
  const wkStart = startOfWeek(now);
  const wkEnd = endOfWeek(now);

  const [stats, trainings, events, attention, allTrainings] = await Promise.all([
    getTrainingAdminStats(),
    getTrainingsInRange(wkStart, wkEnd),
    listEventsInRange(wkStart, wkEnd),
    getMembersNeedingAttention(5),
    listTrainingsForManagement(),
  ]);

  const STATS = [
    { l: 'Heute', v: String(stats.today), s: stats.today === 1 ? 'Training' : 'Trainings', tone: 'text-lake-700' },
    {
      l: 'Diese Woche',
      v: String(stats.thisWeek),
      s: events.length > 0 ? `inkl. ${events.length} ${events.length === 1 ? 'Match' : 'Termine'}` : 'Trainings',
      tone: 'text-forest-700',
    },
    {
      l: 'Abgesagt',
      v: String(stats.cancelledThisWeek),
      s: stats.cancelledThisWeek === 0 ? 'keine Ausfälle' : 'diese Woche',
      tone: 'text-danger',
    },
    {
      l: 'Anwesend Ø',
      v: stats.attendanceRate !== null ? `${stats.attendanceRate} %` : '—',
      s: 'letzte 4 Wochen',
      tone: 'text-sand-700',
    },
  ];

  const week = [
    ...trainings.map((t) => ({
      kind: 'training' as const,
      type: 'Training' as const,
      title: t.title,
      time: { day: t.startsAt.getDate(), month: MONTHS_DE[t.startsAt.getMonth()], hour: `${pad(t.startsAt.getHours())}:${pad(t.startsAt.getMinutes())} – ${pad(t.endsAt.getHours())}:${pad(t.endsAt.getMinutes())}` },
      court: t.court ?? '—',
      trainer: t.trainerName ?? undefined,
      slots: t.maxAttendees ? `${t.yesCount} von ${t.maxAttendees}` : `${t.yesCount} zugesagt`,
      status: t.cancelled ? ('cancelled' as const) : undefined,
      startsAt: t.startsAt,
      editHref: `/admin/trainings/${t.id}`,
    })),
    ...events.map((e) => ({
      kind: 'event' as const,
      type: (e.kind === 'match' ? 'Match' : 'Event') as 'Match' | 'Event',
      title: e.title,
      time: { day: e.startsAt.getDate(), month: MONTHS_DE[e.startsAt.getMonth()], hour: `${pad(e.startsAt.getHours())}:${pad(e.startsAt.getMinutes())}` },
      court: e.location ?? '—',
      trainer: undefined,
      slots: undefined,
      status: undefined,
      startsAt: e.startsAt,
      editHref: `/admin/veranstaltungen/${e.id}`,
    })),
  ].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Planung
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Trainings &amp; Termine
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/veranstaltungen/neu">
            <Button variant="secondary" icon={<Icon.Trophy size={16} />}>
              Veranstaltung
            </Button>
          </Link>
          <Link href="/admin/trainings/neu">
            <Button variant="primary" icon={<Icon.Plus size={16} />}>
              Training anlegen
            </Button>
          </Link>
        </div>
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

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[22px] text-stone-800">Diese Woche</h2>
            <div className="flex items-center gap-1.5">
              {['Alle', 'Training', 'Match', 'Event'].map((f, i) => (
                <button
                  type="button"
                  key={f}
                  className={[
                    'px-3 h-8 rounded-full text-[12.5px] font-medium border',
                    i === 0
                      ? 'bg-stone-800 text-paper-50 border-stone-800'
                      : 'bg-white text-stone-700 border-stone-200',
                  ].join(' ')}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {week.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-lg px-5 py-8 text-center text-[14px] text-stone-500">
                Diese Woche sind keine Termine angesetzt.
              </div>
            )}
            {week.map((t, i) => (
              <Link key={`${t.kind}-${i}`} href={t.editHref} className="block">
                <TerminCard
                  type={t.type}
                  title={t.title}
                  time={t.time}
                  court={t.court}
                  trainer={t.trainer}
                  slots={t.slots}
                  status={t.status}
                />
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h3 className="font-display text-[18px] text-stone-800">Aufmerksamkeit nötig</h3>
            <div className="mt-3 space-y-3">
              {attention.length === 0 && (
                <div className="text-[13px] text-stone-500">Alle Mitglieder haben rückgemeldet.</div>
              )}
              {attention.map((m) => (
                <div key={m.memberId} className="flex items-start gap-3">
                  <Avatar initials={m.initials} tone={m.tone as AvatarTone} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-stone-800 leading-tight">{m.name}</div>
                    <div className="text-[12.5px] text-stone-500 mt-0.5 leading-snug">{m.issue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h3 className="font-display text-[18px] text-stone-800">Schnellaktionen</h3>
            <div className="mt-3 space-y-2">
              <Badge tone="forest" icon={<Icon.Check size={11} />}>
                Anwesenheit-Erinnerung senden
              </Badge>
              <div className="text-[12.5px] text-stone-500 mt-2">
                {attention.length} {attention.length === 1 ? 'Person' : 'Personen'} ohne Rückmeldung
              </div>
            </div>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Reminder verschicken
            </Button>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] text-stone-800">Alle Trainings verwalten</h2>
          <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
            {allTrainings.length} gesamt
          </span>
        </div>
        <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[170px_minmax(200px,1fr)_150px_150px_110px_44px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
            <span>Wann</span>
            <span>Titel</span>
            <span>Mannschaft</span>
            <span>Trainer</span>
            <span>Status</span>
            <span />
          </div>
          {allTrainings.length === 0 && (
            <div className="px-5 py-8 text-center text-[14px] text-stone-500">
              Noch keine Trainings angelegt.
            </div>
          )}
          {allTrainings.map((t, i) => (
            <Link
              key={t.id}
              href={`/admin/trainings/${t.id}`}
              className={[
                'grid grid-cols-[170px_minmax(200px,1fr)_150px_150px_110px_44px] gap-3 px-5 py-3.5 items-center',
                i % 2 ? '' : 'bg-paper-50/40',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
              ].join(' ')}
            >
              <span className="font-mono text-[12px] text-stone-600">
                {pad(t.startsAt.getDate())}. {MONTHS_DE[t.startsAt.getMonth()].slice(0, 3)} ·{' '}
                {pad(t.startsAt.getHours())}:{pad(t.startsAt.getMinutes())}
              </span>
              <span className="text-[14px] font-medium text-stone-800 truncate">{t.title}</span>
              <span className="text-[13.5px] text-stone-600 truncate">{t.teamName ?? '—'}</span>
              <span className="text-[13.5px] text-stone-600 truncate">{t.trainerName ?? '—'}</span>
              <span>
                {t.cancelled ? (
                  <Badge tone="danger">Abgesagt</Badge>
                ) : (
                  <Badge tone="forest">Geplant</Badge>
                )}
              </span>
              <span className="text-stone-400 inline-flex justify-end">
                <Icon.Edit size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}
