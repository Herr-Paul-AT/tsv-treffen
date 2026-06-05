import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { getCurrentMember } from '@/lib/db/queries/session';
import { getProfileStats, getProfileTeams } from '@/lib/db/queries/profile';
import { signOut } from '@/lib/actions/auth';

export const dynamic = 'force-dynamic';

const ROLE_LABEL: Record<string, string> = {
  obmann: 'Obmann',
  admin: 'Admin',
  trainer: 'Trainer',
  jugendleiter: 'Jugendleiter',
  member: 'Mitglied',
};

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'bezahlt',
  open: 'offen',
  partial: 'anteilig',
  waived: 'erlassen',
};

export default async function ProfilPage() {
  const me = await getCurrentMember();
  if (!me) {
    return (
      <main className="px-5 py-12 text-center">
        <p className="text-[16px] text-stone-700">Kein angemeldetes Mitglied gefunden.</p>
        <Link href="/login" className="mt-4 inline-block text-lake-700 font-medium">Anmelden</Link>
      </main>
    );
  }

  const [teamList, stats] = await Promise.all([getProfileTeams(me.id), getProfileStats(me.id)]);
  const primaryTeam = teamList[0];
  const year = new Date().getFullYear();

  return (
    <>
      <div className="pt-6 px-5 pb-2 flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-stone-500">Profil</span>
        <Link
          href="#"
          aria-label="Einstellungen"
          className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-700"
        >
          <Icon.Settings size={18} />
        </Link>
      </div>

      <div className="px-5 pb-8">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center gap-4">
            <Avatar initials={me.initials} size={72} tone={me.avatarTone as AvatarTone} />
            <div className="flex-1 min-w-0">
              <div className="font-display text-[24px] text-stone-800 leading-[1.05]">
                {me.firstName} {me.lastName}
              </div>
              <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.16em] mt-1">
                Mitglied seit {new Date(me.memberSince).getFullYear()}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="dark">{ROLE_LABEL[me.role] ?? me.role}</Badge>
                {primaryTeam && <Badge tone="lake">{primaryTeam.name}</Badge>}
                {me.lkRating && (
                  <Badge tone="sand" icon={<Icon.Trophy size={11} />}>LK {me.lkRating}</Badge>
                )}
              </div>
            </div>
          </div>
          <Link href="/app/profil/bearbeiten" className="mt-4 block">
            <Button variant="secondary" size="md" icon={<Icon.Edit size={16} />} className="w-full">
              Profil bearbeiten
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">
              {stats.trainingsThisSeason}
            </div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">
              Trainings {String(year).slice(2)}
            </div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">{stats.recordLabel}</div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">
              Bilanz
            </div>
          </div>
          <div className="bg-white rounded-md border border-stone-200 p-3 text-center">
            <div className="font-display text-[24px] text-stone-800 leading-none">
              {Math.round(stats.attendanceRate * 100)}%
            </div>
            <div className="font-mono text-[10px] text-stone-500 uppercase tracking-[0.14em] mt-1">
              Anwesenheit
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 bg-white rounded-lg border border-stone-200 overflow-hidden">
          {[
            { href: '/app/kalender', icon: <Icon.Calendar />, label: 'Meine Termine', hint: `${stats.upcomingThisWeek} kommend` },
            { href: '#', icon: <Icon.Bell />, label: 'Benachrichtigungen', hint: 'Push & E-Mail' },
            { href: '/app/platzbuchung', icon: <Icon.Court />, label: 'Platzbuchungen', hint: 'eTennis' },
            ...(primaryTeam
              ? [{ href: '/admin/mannschaften', icon: <Icon.Trophy />, label: `Mannschaft ${primaryTeam.name}`, hint: primaryTeam.league }]
              : []),
            { href: '/app/beitragskonto', icon: <Icon.Mail />, label: 'Beitragskonto', hint: `${year} ${PAYMENT_LABEL[me.paymentStatus] ?? me.paymentStatus}` },
            { href: '/app/dokumente', icon: <Icon.Document />, label: 'Dokumente', hint: 'Statuten · Beitragsordnung · Protokolle' },
            { href: '/', icon: <Icon.Home />, label: 'Zur öffentlichen Website', hint: 'tsv-treffen.at' },
          ].map((it, i, arr) => (
            <Link
              href={it.href}
              key={it.label}
              className={[
                'w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-paper-50',
                i < arr.length - 1 ? 'border-b border-stone-100' : '',
              ].join(' ')}
            >
              <span className="w-9 h-9 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center">
                {it.icon}
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-medium text-stone-800 leading-tight">{it.label}</div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em] mt-0.5">
                  {it.hint}
                </div>
              </div>
              <Icon.ChevronRight size={16} className="text-stone-400" />
            </Link>
          ))}
        </div>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-md text-danger font-medium text-[15px] border border-danger/20 bg-white hover:bg-danger/5"
          >
            Abmelden
          </button>
        </form>
      </div>
    </>
  );
}
