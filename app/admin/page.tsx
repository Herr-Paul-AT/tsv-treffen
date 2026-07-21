import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getMemberStats } from '@/lib/db/queries/members';
import { getNewsAdminStats } from '@/lib/db/queries/news-admin';
import { getDuesStats } from '@/lib/db/queries/dues';
import { getTrainingAdminStats, getMembersNeedingAttention } from '@/lib/db/queries/admin-trainings';
import { getUpcomingBirthdays } from '@/lib/db/queries/birthdays';
import { listNewsletters } from '@/lib/db/queries/newsletters';
import { listUpcomingEvents } from '@/lib/db/queries/events';
import { countNewMembershipRequests } from '@/lib/db/queries/membership-requests';
import { MONTHS_DE } from '@/lib/format';

export const dynamic = 'force-dynamic';

function eur(cents: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function AdminLandingPage() {
  const year = new Date().getFullYear();
  const [memberStats, newsStats, duesStats, trainingStats, birthdays, attention, drafts, upcoming, newRequests] = await Promise.all([
    getMemberStats(),
    getNewsAdminStats(),
    getDuesStats(year),
    getTrainingAdminStats(),
    getUpcomingBirthdays(30),
    getMembersNeedingAttention(3),
    listNewsletters(),
    listUpcomingEvents(4),
    countNewMembershipRequests(),
  ]);
  const draftCount = drafts.filter((d) => d.status === 'draft').length;

  const MODULES = [
    {
      href: '/admin/mitglieder',
      label: 'Mitglieder',
      icon: <Icon.Users size={20} />,
      hint: `${memberStats.total} gesamt · ${memberStats.paymentsOpen} Beiträge offen`,
      tone: 'lake',
    },
    {
      href: '/admin/mannschaften',
      label: 'Mannschaften',
      icon: <Icon.Trophy size={20} />,
      hint: '8 Teams aktiv',
      tone: 'forest',
    },
    {
      href: '/admin/trainings',
      label: 'Trainings & Termine',
      icon: <Icon.Calendar size={20} />,
      hint: `${trainingStats.thisWeek} diese Woche · ${trainingStats.cancelledThisWeek} abgesagt`,
      tone: 'lake',
    },
    {
      href: '/admin/veranstaltungen',
      label: 'Veranstaltungen',
      icon: <Icon.Trophy size={20} />,
      hint: upcoming.length > 0 ? `Nächster: ${upcoming[0].title}` : 'Turniere · Treffen · Termine',
      tone: 'sand',
    },
    {
      href: '/admin/news',
      label: 'News',
      icon: <Icon.News size={20} />,
      hint: `${newsStats.published} veröffentlicht · ${newsStats.drafts} Entwürfe`,
      tone: 'sand',
    },
    {
      href: '/admin/anmeldungen',
      label: 'Anmeldungen',
      icon: <Icon.Users size={20} />,
      hint: newRequests > 0 ? `${newRequests} neue Anmeldung${newRequests === 1 ? '' : 'en'}` : 'Keine offenen Anmeldungen',
      tone: 'lake',
    },
    {
      href: '/admin/tarife',
      label: 'Tarife & Pakete',
      icon: <Icon.Trophy size={20} />,
      hint: 'Preise & Mitgliedspakete',
      tone: 'forest',
    },
    {
      href: '/admin/beitraege',
      label: 'Beiträge',
      icon: <Icon.Mail size={20} />,
      hint: `${eur(duesStats.openCents)} offen · ${Math.round(duesStats.collectionRate * 100)} % Quote`,
      tone: 'sand',
    },
    {
      href: '/admin/rundmail',
      label: 'Rundmail',
      icon: <Icon.Bell size={20} />,
      hint: draftCount > 0 ? `${draftCount} Entwurf wartet` : 'Alle Mails raus',
      tone: 'lake',
    },
    {
      href: '/admin/dokumente',
      label: 'Dokumente',
      icon: <Icon.Document size={20} />,
      hint: 'Statuten · Beitragsordnung · Protokolle',
      tone: 'stone',
    },
    {
      href: '/admin/platz-programm',
      label: 'Was passiert am Platz',
      icon: <Icon.Calendar size={20} />,
      hint: 'Trainings, Jugendspiele, Cups',
      tone: 'forest',
    },
    {
      href: '/admin/faq',
      label: 'Häufige Fragen',
      icon: <Icon.Info size={20} />,
      hint: 'FAQ auf der Startseite',
      tone: 'stone',
    },
    {
      href: '/admin/partner',
      label: 'Sportliche Partner',
      icon: <Icon.External size={20} />,
      hint: 'Partner & Links auf der Startseite',
      tone: 'lake',
    },
    {
      href: '/admin/sponsoren',
      label: 'Sponsoren',
      icon: <Icon.Star size={20} />,
      hint: 'Logos & Links auf der Startseite',
      tone: 'sand',
    },
    {
      href: '/admin/platzbuchung',
      label: 'Platzbuchung',
      icon: <Icon.Court size={20} />,
      hint: 'tennisplatz.info',
      tone: 'forest',
    },
  ];

  return (
    <main className="px-8 py-8 max-w-[1280px] mx-auto">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
        Adminbereich
      </div>
      <h1 className="font-display text-[44px] leading-[1.05] text-stone-800 mt-2">Verwaltung</h1>
      <p className="text-[16px] text-stone-600 mt-3 max-w-2xl">
        Live-Übersicht des Vereins-Backoffice — Mitglieder, Finanzen, Kommunikation, Termine.
        Stand: {new Date().toLocaleDateString('de-AT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}.
      </p>

      {/* KPI Row */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
            Mitglieder
          </div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">
            {memberStats.total}
          </div>
          <div className="mt-2 text-[12.5px] font-medium text-forest-700">
            {memberStats.active} aktiv · {memberStats.probe} Probe
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
            Beiträge {year}
          </div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">
            {Math.round(duesStats.collectionRate * 100)}%
          </div>
          <div className="mt-2 text-[12.5px] font-medium text-stone-600">
            {eur(duesStats.openCents)} offen
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
            Trainings diese Woche
          </div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">
            {trainingStats.thisWeek}
          </div>
          <div className="mt-2 text-[12.5px] font-medium text-lake-700">
            Anwesend Ø {trainingStats.attendanceRate ?? '—'}%
          </div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
            Geburtstage 30 Tage
          </div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">
            {birthdays.length}
          </div>
          <div className="mt-2 text-[12.5px] font-medium text-sand-700">
            {birthdays.filter((b) => b.daysAway <= 7).length} diese Woche
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <h2 className="font-display text-[24px] text-stone-800 mt-12">Module</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="bg-white rounded-lg border border-stone-200 p-5 hover:border-stone-300 hover:shadow-card transition-all group"
          >
            <span className="w-10 h-10 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center group-hover:bg-stone-800 group-hover:text-paper-50 transition-colors">
              {m.icon}
            </span>
            <div className="font-display text-[20px] text-stone-800 mt-3 leading-tight">{m.label}</div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-1.5 leading-[1.4]">
              {m.hint}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom split: Birthdays + Attention + Events */}
      <div className="mt-12 grid lg:grid-cols-3 gap-4">
        <section className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[18px] text-stone-800">
              <span className="inline-flex items-center gap-2">
                <Icon.Cake size={18} className="text-sand-600" />
                Anstehende Geburtstage
              </span>
            </h3>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
              30 Tage
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            {birthdays.length === 0 && (
              <p className="text-[13.5px] text-stone-500">Keine Geburtstage im nächsten Monat.</p>
            )}
            {birthdays.slice(0, 5).map((b) => (
              <div key={b.memberId} className="flex items-center gap-3">
                <Avatar initials={b.initials} size={32} tone={b.tone} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-stone-800 leading-tight">{b.name}</div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-0.5">
                    {b.birthdate.getDate()}. {MONTHS_DE[b.birthdate.getMonth()]} · wird {b.turning}
                  </div>
                </div>
                {b.daysAway === 0 ? (
                  <Badge tone="sand">heute</Badge>
                ) : b.daysAway <= 7 ? (
                  <Badge tone="forest">in {b.daysAway} T</Badge>
                ) : (
                  <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
                    in {b.daysAway} T
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg border border-stone-200 p-5">
          <h3 className="font-display text-[18px] text-stone-800">Aufmerksamkeit nötig</h3>
          <div className="mt-3 space-y-3">
            {attention.length === 0 && (
              <p className="text-[13.5px] text-stone-500">Alles im grünen Bereich.</p>
            )}
            {attention.map((m) => (
              <div key={m.memberId} className="flex items-start gap-3">
                <Avatar initials={m.initials} tone={m.tone as AvatarTone} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-medium text-stone-800 leading-tight">{m.name}</div>
                  <div className="text-[12px] text-stone-500 mt-0.5 leading-snug">{m.issue}</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/trainings"
            className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-lake-700"
          >
            Zu Trainings <Icon.ChevronRight size={14} />
          </Link>
        </section>

        <section className="bg-stone-800 text-paper-50 rounded-lg p-5">
          <h3 className="font-display text-[18px]">Anstehende Termine</h3>
          <div className="mt-3 space-y-2.5">
            {upcoming.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-baseline gap-3">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sand-300 w-16 flex-none">
                  {String(e.startsAt.getDate()).padStart(2, '0')}. {MONTHS_DE[e.startsAt.getMonth()].slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] text-paper-50 leading-tight">{e.title}</div>
                  {e.location && (
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper-100/60 mt-0.5">
                      {e.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="text-[13.5px] text-paper-100/70">Keine geplanten Vereinstermine.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
