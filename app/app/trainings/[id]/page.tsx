import { notFound } from 'next/navigation';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { RsvpSegmented } from '@/components/feedback/RsvpSegmented';
import { Avatar, AvatarGroup, type AvatarTone } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getTrainingById, getTrainingMeta, getTrainingRoster } from '@/lib/db/queries/trainings';
import { getCurrentMember } from '@/lib/db/queries/session';
import { formatRelativeFromNow, formatTimeRange, shortDateLabel, MONTHS_DE, WEEKDAYS_DE_SHORT } from '@/lib/format';

export const dynamic = 'force-dynamic';

const STATUS_TONE = {
  yes: { label: 'Zugesagt', color: 'text-forest-700' },
  maybe: { label: 'Vielleicht', color: 'text-sand-700' },
  no: { label: 'Abgesagt', color: 'text-stone-500' },
} as const;

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const training = await getTrainingById(id);
  if (!training) notFound();

  const [meta, roster, me] = await Promise.all([
    getTrainingMeta(training.id),
    getTrainingRoster(training.id),
    getCurrentMember(),
  ]);

  const myRsvp = me ? roster.find((r) => r.member.id === me.id) ?? null : null;

  // Trainer info
  let trainerInitials = 'MP';
  let trainerTone: AvatarTone = 'lake';
  if (training.trainerId) {
    const t = await db.select().from(members).where(eq(members.id, training.trainerId)).limit(1);
    if (t[0]) {
      trainerInitials = t[0].initials;
      trainerTone = t[0].avatarTone as AvatarTone;
    }
  }

  const yes = roster.filter((r) => r.status === 'yes');
  const maybe = roster.filter((r) => r.status === 'maybe');
  const no = roster.filter((r) => r.status === 'no');

  const startDay = `${WEEKDAYS_DE_SHORT[training.startsAt.getDay()]} ${training.startsAt.getDate()}. ${MONTHS_DE[training.startsAt.getMonth()]}`;

  return (
    <>
      <MobileHeader
        backHref="/app/dashboard"
        title={training.title}
        lead={`${training.teamName ?? 'Termin'} · ${shortDateLabel(training.startsAt)} · ${String(training.startsAt.getHours()).padStart(2, '0')}:${String(training.startsAt.getMinutes()).padStart(2, '0')}`}
      />
      <div className="px-5 pb-12">
        {/* Hero card */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="h-32 ph-lake relative">
            <div className="absolute bottom-3 left-4">
              <Badge tone="lake">Training · {training.teamName ?? 'Offen'}</Badge>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Datum</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">{startDay}</div>
              </div>
              <div className="border-l border-r border-stone-100">
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Uhrzeit</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">
                  {formatTimeRange(training.startsAt, training.endsAt)}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Plätze</div>
                <div className="font-display text-[20px] text-stone-800 leading-tight mt-1">
                  {training.court ?? '—'}
                </div>
              </div>
            </div>
            <hr className="my-4 border-stone-100" />
            <div className="flex items-center gap-3">
              <Avatar initials={trainerInitials} size={40} tone={trainerTone} />
              <div className="flex-1">
                <div className="text-[14px] font-medium text-stone-800">
                  {training.trainerName ?? 'Kein Trainer hinterlegt'}
                </div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">Trainer</div>
              </div>
              <button
                type="button"
                aria-label="Trainer kontaktieren"
                className="w-11 h-11 rounded-md border border-stone-200 inline-flex items-center justify-center text-stone-600"
              >
                <Icon.Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status segmented */}
        <div className="mt-6">
          <div className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.18em]">Deine Rückmeldung</div>
          <RsvpSegmented trainingId={training.id} initial={myRsvp?.status ?? null} />
          {myRsvp && (
            <div
              className={`mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] flex items-center gap-1.5 ${STATUS_TONE[myRsvp.status].color}`}
            >
              <Icon.Check size={11} /> Du hast {STATUS_TONE[myRsvp.status].label.toLowerCase()} · {formatRelativeFromNow(myRsvp.respondedAt)}
            </div>
          )}
        </div>

        {/* Roster */}
        <div className="mt-6 bg-white rounded-lg border border-stone-200 p-4">
          <h3 className="font-display text-[18px] text-stone-800">
            Mannschaft · {training.maxAttendees ?? meta.yesCount + meta.maybeCount + meta.noCount} Spieler
          </h3>
          <div className="mt-3 space-y-4">
            <div>
              <div className="font-mono text-[10.5px] text-forest-700 uppercase tracking-[0.18em] mb-1.5">
                Zugesagt · {yes.length}
              </div>
              {yes.length > 0 ? (
                <AvatarGroup
                  items={yes.map((y) => ({ initials: y.member.initials, tone: y.member.avatarTone as AvatarTone }))}
                  max={6}
                  size={32}
                />
              ) : (
                <span className="text-[13px] text-stone-500">Niemand hat zugesagt.</span>
              )}
            </div>
            <div>
              <div className="font-mono text-[10.5px] text-sand-700 uppercase tracking-[0.18em] mb-1.5">
                Vielleicht · {maybe.length}
              </div>
              {maybe.length > 0 ? (
                <AvatarGroup
                  items={maybe.map((y) => ({ initials: y.member.initials, tone: y.member.avatarTone as AvatarTone }))}
                  size={32}
                />
              ) : (
                <span className="text-[13px] text-stone-500">Keine offenen Rückmeldungen.</span>
              )}
            </div>
            <div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.18em] mb-1.5">
                Abgesagt · {no.length}
              </div>
              {no.length > 0 ? (
                <AvatarGroup
                  items={no.map((y) => ({ initials: y.member.initials, tone: y.member.avatarTone as AvatarTone }))}
                  size={32}
                />
              ) : (
                <span className="text-[13px] text-stone-500">Keine Absagen.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
