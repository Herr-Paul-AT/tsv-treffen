import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { RsvpControls } from '@/components/feedback/RsvpControls';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getCurrentMember } from '@/lib/db/queries/session';
import { getNextTrainingForMember } from '@/lib/db/queries/trainings';
import { listNews } from '@/lib/db/queries/news';
import {
  formatDayMonth,
  formatGermanDate,
  formatRelativeFromNow,
  formatTimeRange,
  shortDateLabel,
} from '@/lib/format';

export const dynamic = 'force-dynamic';

const QUICK = [
  { href: '/app/platzbuchung', icon: <Icon.Court size={20} />, label: 'Platz buchen' },
  { href: '/app/kalender', icon: <Icon.Calendar size={20} />, label: 'Kalender' },
  { href: '/app/news/tabelle', icon: <Icon.Trophy size={20} />, label: 'Tabelle' },
];

const NEWS_BADGE_TONES = ['sand', 'lake', 'forest'] as const;

const RESERVATION_URL = 'https://treffen.tennisplatz.info/reservierung';

export default async function DashboardPage() {
  const me = await getCurrentMember();
  const greeting = me ? `Servus, ${me.firstName}` : 'Servus';

  const [nextTraining, latestNews] = await Promise.all([
    me ? getNextTrainingForMember(me.id) : Promise.resolve(null),
    listNews(2),
  ]);

  const now = new Date();
  return (
    <>
      <MobileHeader
        lead={formatGermanDate(now)}
        title={greeting}
        action={
          <button
            type="button"
            aria-label="Benachrichtigungen"
            className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"
          >
            <Icon.Bell size={18} />
          </button>
        }
      />
      <div className="px-5 pb-8">
        {/* Next training callout */}
        {nextTraining ? (
          <div className="bg-stone-800 text-paper-50 rounded-xl overflow-hidden relative">
            <div className="absolute -top-6 -right-8 opacity-10">
              <TSVMark size={180} variant="negative" />
            </div>
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <Badge tone="dark">
                  <span className="text-sand-300">●</span>&nbsp;Nächstes Training
                </Badge>
                <span className="font-mono text-[11px] text-paper-100/70 uppercase tracking-[0.14em]">
                  {shortDateLabel(nextTraining.startsAt)} · {formatRelativeFromNow(nextTraining.startsAt)}
                </span>
              </div>
              <h3 className="font-display text-[24px] leading-[1.15] mt-3">{nextTraining.title}</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 text-[12.5px] text-paper-100/85">
                <div className="flex items-center gap-1.5">
                  <Icon.Clock size={13} />
                  {formatTimeRange(nextTraining.startsAt, nextTraining.endsAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon.MapPin size={13} />
                  {nextTraining.court ?? '—'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon.Users size={13} />
                  {nextTraining.yesCount} von {nextTraining.maxAttendees ?? nextTraining.yesCount + nextTraining.maybeCount + nextTraining.noCount + 1}
                </div>
              </div>
              <RsvpControls
                title={`${nextTraining.title} · ${shortDateLabel(nextTraining.startsAt)} ${formatTimeRange(nextTraining.startsAt, nextTraining.endsAt)}`}
                initial={nextTraining.myStatus ?? 'none'}
                trainingId={nextTraining.id}
              />
              <div className="mt-3 text-center">
                <Link
                  href={`/app/trainings/${nextTraining.id}`}
                  className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper-100/60 hover:text-paper-50"
                >
                  Termin-Details ansehen →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <Badge tone="neutral">Kein Training geplant</Badge>
            <p className="mt-3 text-[14.5px] text-stone-700 leading-[1.55]">
              Für dich ist gerade kein Mannschaftstraining angesetzt. Schau im{' '}
              <Link href="/app/kalender" className="text-lake-700 font-medium">Kalender</Link> nach offenen Slots.
            </p>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {QUICK.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="bg-white rounded-lg border border-stone-200 p-3.5 flex flex-col items-start gap-2"
            >
              <span className="w-9 h-9 rounded-md bg-lake-50 text-lake-700 inline-flex items-center justify-center">
                {a.icon}
              </span>
              <span className="text-[13px] font-medium text-stone-800 leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* News strip */}
        <div className="mt-7">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[18px] text-stone-800">Aus dem Verein</h3>
            <Link
              href="/app/news"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-lake-700"
            >
              Alle
            </Link>
          </div>
          <div className="mt-3 space-y-2.5">
            {latestNews.map((n, i) => (
              <Link
                key={n.id}
                href={`/app/news/${n.slug}`}
                className="block bg-white rounded-lg border border-stone-200 p-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge tone={NEWS_BADGE_TONES[i % NEWS_BADGE_TONES.length]}>{n.eyebrow ?? 'Verein'}</Badge>
                  <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
                    {n.publishedAt ? formatDayMonth(n.publishedAt) : ''}
                  </span>
                </div>
                <div className="font-display text-[16.5px] text-stone-800 leading-[1.2]">{n.title}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Platz reservieren */}
        <a
          href={RESERVATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 block bg-white rounded-lg border border-stone-200 p-4 transition-all hover:border-stone-300 hover:shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex-none rounded-full bg-paper-100 text-stone-700 inline-flex items-center justify-center">
              <Icon.Court size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-[18px] text-stone-800 leading-tight">Platz reservieren</h3>
              <p className="text-[13.5px] text-stone-600 mt-0.5 leading-snug">
                Freie Zeiten ansehen und direkt online buchen.
              </p>
            </div>
            <Icon.External size={16} className="text-stone-400 flex-none" />
          </div>
        </a>
      </div>
    </>
  );
}
