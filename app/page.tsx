import Link from 'next/link';
import { TSVLockup, TSVMark } from '@/components/brand/Logo';
import { AvatarGroup } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listNews } from '@/lib/db/queries/news';
import { listUpcomingEvents } from '@/lib/db/queries/events';
import { listTeamsWithRoster } from '@/lib/db/queries/teams';
import { listActiveSponsors } from '@/lib/db/queries/sponsors';
import { listActiveMembershipPlans } from '@/lib/db/queries/membership-plans';
import { getClubStats } from '@/lib/db/queries/stats';
import { formatDayMonth, formatDayMonthCaps, MONTHS_DE } from '@/lib/format';

export const dynamic = 'force-dynamic';

const RESERVATION_URL = 'https://treffen.tennisplatz.info/reservierung';

const NEWS_EYEBROW_TONES: Record<string, string> = {
  Saisoneröffnung: 'text-sand-700',
  Mannschaftsspiel: 'text-lake-700',
  Vereinsmeisterschaft: 'text-sand-700',
};

const TRAININGS = [
  { day: 'Mo', time: '17:00 – 18:30', who: 'Damen 35+ / 50+', trainer: 'K. Wallner', court: 'Platz 3' },
  { day: 'Di', time: '16:30 – 18:00', who: 'Jugend U14 / U16', trainer: 'M. Pirker', court: 'Platz 2 & 3' },
  { day: 'Di', time: '19:00 – 21:00', who: 'Herren I · Mannschaft', trainer: 'M. Pirker', court: 'Platz 1 & 2' },
  { day: 'Mi', time: '14:30 – 16:30', who: 'Jugend U10 / U12', trainer: 'A. Brunner', court: 'Platz 3' },
  { day: 'Mi', time: '18:00 – 20:00', who: 'Herren II · Mannschaft', trainer: 'M. Pirker', court: 'Platz 1 & 2' },
  { day: 'Do', time: '16:30 – 18:00', who: 'Jugend U14 / U16', trainer: 'M. Pirker', court: 'Platz 2 & 3' },
  { day: 'Do', time: '19:00 – 21:00', who: 'Herren I · Mannschaft', trainer: 'M. Pirker', court: 'Platz 1 & 2' },
];

function formatPlanPrice(cents: number): string {
  return new Intl.NumberFormat('de-AT', {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatEventDate(start: Date, end: Date | null): string {
  if (end && (end.getDate() !== start.getDate() || end.getMonth() !== start.getMonth())) {
    const m = MONTHS_DE[end.getMonth()].toUpperCase();
    if (end.getMonth() === start.getMonth()) {
      return `${String(start.getDate()).padStart(2, '0')}.–${String(end.getDate()).padStart(2, '0')}. ${m}`;
    }
    return `${formatDayMonthCaps(start)} – ${formatDayMonthCaps(end)}`;
  }
  return formatDayMonthCaps(start);
}

const FAQS = [
  {
    q: 'Wann startet die Saison 2026?',
    a: 'Am Samstag, 12. April. Vorbereitungstrainings beginnen Ende März, sobald die Plätze trocken sind. Die Outdoor-Saison endet üblicherweise Mitte Oktober.',
  },
  {
    q: 'Kann ich vor einer Mitgliedschaft schnuppern?',
    a: 'Ja, jederzeit. Schreib uns an office@tsv-treffen.at oder ruf an — wir finden einen Trainings-Slot, an dem du eine Stunde mitspielen kannst. Kostenlos, ohne Verpflichtung.',
  },
  {
    q: 'Ich bin nicht Mitglied — kann ich trotzdem spielen?',
    a: 'Mit einem Vereinsmitglied als Begleitung ja — Gastspiel kostet 15 € pro Stunde, gebucht über das Online-Reservierungssystem. Mitglieder haben 2 bis 4 Gastspiele pro Saison frei.',
  },
  {
    q: 'Gibt es Schläger zum Ausleihen?',
    a: 'Wir haben einen kleinen Bestand an Leihschlägern im Vereinsheim — speziell für Schnupperer und Kinder. Für regelmäßiges Spielen empfehlen wir einen eigenen Schläger.',
  },
  {
    q: 'Was passiert im Winter?',
    a: 'Outdoor pausiert von Mitte Oktober bis April. Für die Hallensaison kooperieren wir mit der Tennis-Halle Villach. Mannschaftstraining läuft dort, Einzelbuchungen zu Sonderkonditionen.',
  },
  {
    q: 'Wie kommt man am besten hin?',
    a: 'Mit dem Auto über A10 Abfahrt Villach Süd, dann Richtung Treffen — 8 Minuten. Parkplätze direkt am Vereinsheim. Mit der Bahn nach Villach, dann Bus 5176 bis Treffen Ortsmitte.',
  },
];

export default async function LandingPage() {
  const [stats, news, events, teams, sponsors, plans] = await Promise.all([
    getClubStats(),
    listNews(3, { publicOnly: true }),
    listUpcomingEvents(8),
    listTeamsWithRoster(),
    listActiveSponsors(),
    listActiveMembershipPlans(),
  ]);
  const adultTeams = teams.filter((t) => !/^Jugend/.test(t.name));
  const youthTeams = teams.filter((t) => /^Jugend/.test(t.name));
  const seasons = new Date().getFullYear() - 1972;
  return (
    <main className="min-h-dvh bg-paper-100">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[520px] sm:h-[620px] bg-stone-800 overflow-hidden">
        <div className="absolute inset-0 ph-stripe-dark" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/10 to-stone-900/85" />
        <div className="absolute -right-6 top-12 opacity-15 pointer-events-none">
          <TSVMark size={320} variant="negative" />
        </div>
        <div className="relative h-full max-w-[1080px] mx-auto flex flex-col justify-end p-6 pb-8 text-paper-50">
          <div className="flex items-center justify-between absolute top-6 left-6 right-6">
            <TSVLockup height={36} color="#FBF8F1" accent="#C39265" />
            <nav className="hidden sm:flex items-center gap-6 text-[14px] text-paper-100/80">
              <a href="#anlage" className="hover:text-paper-50">Anlage</a>
              <a href="#mannschaften" className="hover:text-paper-50">Mannschaften</a>
              <a href="#training" className="hover:text-paper-50">Training</a>
              <a href="#mitgliedschaft" className="hover:text-paper-50">Mitglied werden</a>
              <Link
                href="/login"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-50"
              >
                Anmelden
              </Link>
            </nav>
            <button
              type="button"
              aria-label="Menü"
              className="sm:hidden text-paper-50/90 w-11 h-11 inline-flex items-center justify-center"
            >
              <Icon.Menu />
            </button>
          </div>
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-sand-300">
              Saison 2026 · Eröffnung am 12. April
            </span>
            <h1 className="font-display text-[40px] sm:text-[64px] leading-[1.02] tracking-[-0.015em] mt-3 max-w-[820px]">
              Tennis beim Schloss
              <br />
              mit Blick auf die Gerlitzen.
            </h1>
            <p className="text-[16px] sm:text-[19px] text-paper-100/85 mt-4 leading-[1.55] max-w-[540px]">
              Drei Sandplätze beim Schloss, direkt am Treffnerbach, mit Blick auf die Gerlitzen.
              Spielen, trainieren, dazugehören — seit 1972.
            </p>
            <div className="flex gap-2 mt-6 flex-wrap">
              <a href="#mitgliedschaft">
                <Button variant="accent" size="lg">
                  Mitglied werden
                </Button>
              </a>
              <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="lg"
                  className="!text-paper-50 hover:!bg-white/10"
                  iconAfter={<Icon.ArrowRight size={16} />}
                >
                  Platz buchen
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK STATS ────────────────────────────────────── */}
      <section className="max-w-[1080px] mx-auto px-5">
        <div className="-mt-8 relative z-10 bg-white rounded-xl border border-stone-200 shadow-card p-5 grid grid-cols-2 gap-3 max-w-md mx-auto">
          <div className="text-center">
            <div className="font-display text-[28px] sm:text-[40px] text-stone-800 leading-none">
              {stats.courts}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 mt-1">
              Sandplätze
            </div>
          </div>
          <div className="text-center border-l border-stone-100">
            <div className="font-display text-[28px] sm:text-[40px] text-stone-800 leading-none">
              {stats.teams}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500 mt-1">
              Mannschaften
            </div>
          </div>
        </div>
      </section>

      {/* ─── ÜBER DEN VEREIN ────────────────────────────────── */}
      <section id="verein" className="max-w-[1080px] mx-auto px-5 mt-16 sm:mt-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
              Seit 1972 · der Verein
            </div>
            <h2 className="font-display text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.01em] text-stone-800 mt-5">
              Tennis beim Schloss,
              <br />
              am Treffnerbach,
              <br />
              vor der Gerlitzen.
            </h2>
          </div>
          <div className="space-y-5 text-[16px] sm:text-[17px] text-stone-700 leading-[1.6]">
            <p>
              Der TSV Schloss Treffen wurde 1972 gegründet — beim Schloss Treffen, direkt am
              Treffnerbach, mit Blick auf die Gerlitzen. Die Bildmarke ist kein Zufall: Tennisball
              als Sonne über dem Berg, das Schloss im Tal, drei Wasserlinien davor.
            </p>
            <p>
              Von der Jugend bis zu den Aktiven: Bei uns spielt man ernst genug für die Tabelle und
              entspannt genug für ein Bier nach dem Match.
            </p>
            <p>
              Was uns trägt: <strong className="text-stone-800">drei perfekt gepflegte
              Sandplätze</strong>, ein gemütliches Vereinsheim und eine Mitgliedschaft, die sich
              anfühlt wie der Verein, der wir seit fünf Jahrzehnten sind.
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 text-[14.5px] text-stone-600">
              <li className="flex items-start gap-2.5">
                <Icon.Mountain size={18} className="text-forest-600 mt-0.5 flex-none" />
                <span>Blick auf die Gerlitzen</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon.Wave size={18} className="text-lake-600 mt-0.5 flex-none" />
                <span>Direkt am Treffnerbach</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon.MapPin size={18} className="text-sand-600 mt-0.5 flex-none" />
                <span>Beim Schloss in Treffen am Ossiachersee</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon.Trophy size={18} className="text-stone-500 mt-0.5 flex-none" />
                <span>{seasons} Saisons Vereinsgeschichte</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── ANLAGE ────────────────────────────────────────── */}
      <section id="anlage" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Die Anlage
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4 max-w-2xl">
          Drei Plätze, ein Vereinsheim, eine Aussicht.
        </h2>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: '3 Sandplätze', sub: 'Gepflegter Sandplatz-Belag', icon: <Icon.Court /> },
            { name: 'Vereinsheim', sub: 'Umkleide, Dusche, kleine Küche', icon: <Icon.Home /> },
            { name: 'Schläger & Ballmaschine', sub: 'Leihschläger + mietbare Ballmaschine', icon: <Icon.Ball /> },
            { name: 'Beim Schloss', sub: 'Ruhige Lage am Treffnerbach', icon: <Icon.MapPin /> },
          ].map((f) => (
            <div key={f.name} className="bg-white rounded-lg border border-stone-200 p-5 transition-all hover:border-stone-300 hover:shadow-card">
              <div className="w-10 h-10 rounded-full bg-paper-100 text-stone-700 inline-flex items-center justify-center">
                {f.icon}
              </div>
              <div className="font-display text-[18px] text-stone-800 mt-4">{f.name}</div>
              <p className="text-[13.5px] text-stone-600 mt-1 leading-snug">{f.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 bg-stone-800 text-paper-50 rounded-xl p-5 sm:p-6 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
              Platzreservierung
            </div>
            <div className="font-display text-[20px] mt-1">Online einen Platz buchen</div>
            <p className="text-[13.5px] text-paper-100/75 mt-1">
              Freie Zeiten ansehen und direkt reservieren.
            </p>
          </div>
          <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="accent" iconAfter={<Icon.ArrowRight size={14} />}>
              Zur Reservierung
            </Button>
          </a>
        </div>
      </section>

      {/* ─── MANNSCHAFTEN ──────────────────────────────────── */}
      <section id="mannschaften" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Mannschaften 2026
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4 max-w-2xl">
          {teams.length} Teams · {adultTeams.length} Erwachsene, {youthTeams.length} Jugend.
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {teams.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-lg border border-stone-200 p-4 transition-all hover:border-stone-300 hover:shadow-card hover:-translate-y-0.5"
            >
              <div className="font-display text-[19px] text-stone-800 leading-tight">{t.name}</div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-1.5">
                {t.league}
              </div>
              <div className="mt-3.5 flex items-center justify-between gap-2">
                {t.roster.length > 0 ? (
                  <>
                    <AvatarGroup
                      items={t.roster.map((r) => ({ initials: r.initials, tone: r.tone }))}
                      max={4}
                      size={26}
                    />
                    <span className="font-mono text-[11px] text-stone-500">
                      {t.roster.length} {t.roster.length === 1 ? 'Spieler:in' : 'Spieler:innen'}
                    </span>
                  </>
                ) : (
                  <span className="text-[12.5px] text-stone-500">Kader in Aufstellung</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── TRAININGSZEITEN ───────────────────────────────── */}
      <section id="training" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Trainingszeiten · Saison 2026
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4 max-w-2xl">
          Was passiert am Platz.
        </h2>
        <p className="text-[15px] text-stone-600 mt-3 max-w-xl leading-[1.6]">
          Mannschaftstrainings sind für die Mannschaftsmitglieder reserviert. Außerhalb dieser
          Zeiten sind alle Plätze für freies Spiel und Buchungen offen.
        </p>

        <div className="mt-6 bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[80px_140px_minmax(180px,1fr)_140px_120px] gap-3 px-5 py-3 bg-paper-50 border-b border-stone-200 font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
            <span>Tag</span>
            <span>Zeit</span>
            <span>Gruppe</span>
            <span>Trainer</span>
            <span>Platz</span>
          </div>
          {TRAININGS.map((t, i) => (
            <div
              key={`${t.day}-${t.time}-${i}`}
              className={[
                'grid grid-cols-[60px_1fr] sm:grid-cols-[80px_140px_minmax(180px,1fr)_140px_120px] gap-x-3 gap-y-1 px-5 py-3.5 items-center',
                'border-b border-stone-100 last:border-b-0',
                i % 2 ? '' : 'bg-paper-50/30',
              ].join(' ')}
            >
              <div className="font-display text-[18px] text-stone-800 leading-none row-span-2 sm:row-span-1">
                {t.day}
              </div>
              <div className="font-mono text-[12.5px] text-stone-700 tracking-[0.05em]">
                {t.time}
              </div>
              <div className="text-[14px] text-stone-800 font-medium col-span-2 sm:col-span-1">
                {t.who}
              </div>
              <div className="text-[13px] text-stone-600 col-start-2 sm:col-start-auto">
                {t.trainer}
              </div>
              <div className="text-[13px] text-stone-600 col-start-2 sm:col-start-auto">
                {t.court}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MITGLIEDSCHAFT ────────────────────────────────── */}
      <section id="mitgliedschaft" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Mitglied werden
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4 max-w-2xl">
          Drei Wege, dazuzugehören.
        </h2>
        <p className="text-[15px] text-stone-600 mt-3 max-w-xl leading-[1.6]">
          Beitragsperiode ist die Sommer-Saison (April bis Oktober). Schnuppertraining ist
          jederzeit kostenlos möglich — meld dich vorher kurz.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <article
              key={p.id}
              className={[
                'rounded-xl border p-6 flex flex-col',
                p.featured
                  ? 'bg-stone-800 text-paper-50 border-stone-800 shadow-pop'
                  : 'bg-white text-stone-800 border-stone-200',
              ].join(' ')}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <div
                    className={[
                      'font-mono text-[11px] uppercase tracking-[0.18em]',
                      p.featured ? 'text-sand-300' : 'text-stone-500',
                    ].join(' ')}
                  >
                    {p.eyebrow}
                  </div>
                  <div
                    className={[
                      'font-display text-[28px] mt-1 leading-none',
                      p.featured ? 'text-paper-50' : 'text-stone-800',
                    ].join(' ')}
                  >
                    {p.name}
                  </div>
                </div>
                {p.featured && <Badge tone="sand">Beliebteste</Badge>}
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={[
                    'font-display text-[48px] leading-none tracking-[-0.02em]',
                    p.featured ? 'text-paper-50' : 'text-stone-800',
                  ].join(' ')}
                >
                  € {formatPlanPrice(p.priceCents)}
                </span>
                <span
                  className={[
                    'font-mono text-[11px] uppercase tracking-[0.14em] ml-1',
                    p.featured ? 'text-paper-100/65' : 'text-stone-500',
                  ].join(' ')}
                >
                  / {p.period}
                </span>
              </div>

              <ul
                className={[
                  'mt-6 space-y-2.5 text-[14px] flex-1',
                  p.featured ? 'text-paper-100/85' : 'text-stone-700',
                ].join(' ')}
              >
                {p.perks.split('\n').filter(Boolean).map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <Icon.Check
                      size={16}
                      className={[
                        'mt-0.5 flex-none',
                        p.featured ? 'text-sand-300' : 'text-forest-600',
                      ].join(' ')}
                    />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link href={`/mitglied-werden?plan=${p.slug}`}>
                  <Button
                    variant={p.featured ? 'accent' : 'primary'}
                    size="lg"
                    className="w-full"
                    iconAfter={<Icon.ArrowRight size={16} />}
                  >
                    Beitreten
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 bg-paper-50 border border-stone-200 rounded-lg p-5 sm:p-6 flex items-start gap-4">
          <Icon.Info size={20} className="text-lake-600 flex-none mt-0.5" />
          <div>
            <div className="font-display text-[18px] text-stone-800">
              Erst schnuppern, dann entscheiden.
            </div>
            <p className="text-[14.5px] text-stone-600 mt-1 leading-[1.55]">
              Schreib uns an{' '}
              <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
                office@tsv-treffen.at
              </a>{' '}
              oder ruf an — wir finden einen Trainings-Slot, an dem du eine Stunde mitspielen kannst.
              Kostenlos, ohne Verpflichtung. Schläger leihen wir dir.
            </p>
          </div>
        </div>
      </section>

      {/* ─── EVENTS 2026 ───────────────────────────────────── */}
      <section id="events" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Saison-Kalender 2026
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4 max-w-2xl">
          Was ist los am Platz.
        </h2>

        <div className="mt-8 relative">
          {events.length > 0 && (
            <div className="absolute left-[68px] sm:left-[88px] top-2 bottom-2 w-px bg-stone-200" aria-hidden="true" />
          )}
          {events.length === 0 && (
            <div className="bg-white rounded-lg border border-stone-200 px-5 py-8 text-center text-[14px] text-stone-500">
              Aktuell sind keine weiteren Termine geplant — schau bald wieder vorbei.
            </div>
          )}
          <div className="space-y-2.5">
            {events.map((e) => {
              const dateLabel = formatEventDate(e.startsAt, e.endsAt);
              const tone = e.kind === 'match' ? 'lake' : 'sand';
              const badgeLabel = e.kind === 'match' ? 'Match' : e.kind === 'tournament' ? 'Turnier' : 'Event';
              return (
                <div
                  key={e.id}
                  className="relative flex items-center gap-4 sm:gap-6 bg-white rounded-lg border border-stone-200 px-5 py-3.5"
                >
                  <div className="w-[80px] sm:w-[100px] flex-none">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                      Datum
                    </div>
                    <div className="font-display text-[15px] sm:text-[17px] text-stone-800 leading-tight mt-0.5 tracking-[-0.005em]">
                      {dateLabel}
                    </div>
                  </div>
                  <span
                    className="absolute left-[64px] sm:left-[84px] w-2 h-2 rounded-full bg-sand-500 ring-4 ring-paper-100"
                    aria-hidden="true"
                  />
                  <div className="flex-1 pl-3 sm:pl-5">
                    <div className="font-display text-[16px] sm:text-[18px] text-stone-800 leading-tight">
                      {e.title}
                    </div>
                    <div className="mt-1">
                      <Badge tone={tone}>{badgeLabel}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── NEWS ──────────────────────────────────────────── */}
      <section className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
              Neuigkeiten
            </div>
            <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4">
              Aus dem Verein
            </h2>
          </div>
          <Link
            href="/app/news"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-lake-700"
          >
            Alle ansehen →
          </Link>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n) => {
            const tone = (n.eyebrow && NEWS_EYEBROW_TONES[n.eyebrow]) ?? 'text-stone-600';
            const meta = `${n.publishedAt ? formatDayMonth(n.publishedAt) : 'Entwurf'}${n.authorName ? ` · ${n.authorName.split(' ').map((p, i) => (i === 0 ? p[0] + '.' : p)).join(' ')}` : ''}`;
            return (
              <Link
                key={n.id}
                href={`/app/news/${n.slug}`}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden group transition-all hover:border-stone-300 hover:shadow-card hover:-translate-y-0.5"
              >
                <div className={`h-44 ${n.imageKind === 'sand' ? 'ph-sand' : n.imageKind === 'forest' ? 'ph-forest' : 'ph-lake'}`} />
                <div className="p-5">
                  <span className={`font-mono text-[11px] uppercase tracking-[0.16em] ${tone}`}>
                    {n.eyebrow ?? 'Verein'}
                  </span>
                  <h3 className="font-display text-[19px] text-stone-800 mt-1.5 leading-[1.2] group-hover:text-stone-900">
                    {n.title}
                  </h3>
                  <p className="text-[13.5px] text-stone-600 mt-2.5 leading-[1.55] line-clamp-2">{n.excerpt}</p>
                  <div className="font-mono text-[11px] text-stone-500 mt-3 uppercase tracking-[0.14em]">
                    {meta}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
              Häufig gefragt
            </div>
            <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4">
              Was meistens
              <br />
              vor dem Beitritt
              <br />
              gefragt wird.
            </h2>
            <p className="text-[14.5px] text-stone-600 mt-4 leading-[1.6]">
              Nichts dabei?{' '}
              <a href="mailto:office@tsv-treffen.at" className="text-lake-700 font-medium">
                Schreib uns
              </a>{' '}
              — wir antworten innerhalb von 24 h.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <span className="font-display text-[17px] sm:text-[18px] text-stone-800 leading-snug pr-2">
                    {f.q}
                  </span>
                  <span className="flex-none w-7 h-7 rounded-full bg-paper-100 text-stone-700 inline-flex items-center justify-center transition-transform group-open:rotate-45">
                    <Icon.Plus size={14} />
                  </span>
                </summary>
                <p className="mt-3 text-[14.5px] text-stone-600 leading-[1.65]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANFAHRT + KONTAKT ─────────────────────────────── */}
      <section id="anfahrt" className="max-w-[1080px] mx-auto px-5 mt-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Anfahrt &amp; Kontakt
        </div>
        <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-4">
          Vorbeikommen.
        </h2>

        <div className="mt-8 grid lg:grid-cols-[1.2fr_1fr] gap-4">
          {/* Karten-Platzhalter — echte Google-Karte folgt */}
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-forest-50 h-[320px] sm:h-[400px]">
            <div className="absolute inset-0 ph-lake opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <TSVMark size={140} variant="mono" className="opacity-40" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg border border-stone-200 p-4 shadow-card">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                Standort
              </div>
              <div className="font-display text-[18px] text-stone-800 mt-1">
                Schlossweg 1, 9521 Treffen am Ossiachersee
              </div>
              <a
                href="https://maps.apple.com/?q=Schlossweg+1+Treffen+am+Ossiachersee"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-lake-700"
              >
                In Karten öffnen <Icon.External size={12} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                Mit dem Auto
              </div>
              <p className="text-[14.5px] text-stone-700 mt-2 leading-[1.55]">
                A10 Tauernautobahn → Abfahrt Villach Süd → Richtung Treffen am Ossiachersee. Vom
                Ortskern dem Schlossweg folgen. Kostenlose Parkplätze direkt am Vereinsheim.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                Mit Bahn &amp; Bus
              </div>
              <p className="text-[14.5px] text-stone-700 mt-2 leading-[1.55]">
                Zug bis Villach Hbf, dann Bus 5176 Richtung Ossiachersee. Haltestelle „Treffen
                Ortsmitte", von dort wenige Minuten zu Fuß über den Schlossweg.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500">
                Kontakt
              </div>
              <div className="mt-2 space-y-1.5 text-[14.5px] text-stone-700">
                <div className="flex items-center gap-2">
                  <Icon.Mail size={14} className="text-stone-400" />
                  <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
                    office@tsv-treffen.at
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Icon.Clock size={14} className="text-stone-400" />
                  <span>Saison: Mo–So 08:00 – 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPONSOREN ────────────────────────────────────── */}
      <section className="max-w-[1080px] mx-auto px-5 mt-20 pb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 rule-eyebrow">
          Saison 2026
        </div>
        <h2 className="font-display text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-stone-800 mt-3">
          Danke an unsere Sponsoren.
        </h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-stone-200 rounded-md h-20 flex items-center justify-center text-center px-2"
            >
              <span className="font-display text-[13.5px] text-stone-700 leading-tight">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="bg-stone-800 text-paper-50 overflow-hidden relative">
        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none">
          <TSVMark size={320} variant="negative" />
        </div>
        <div className="relative max-w-[1080px] mx-auto px-5 sm:px-10 py-16 text-center sm:text-left grid sm:grid-cols-[1.4fr_auto] items-center gap-8">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-sand-300">
              Bereit für die Saison 2026?
            </div>
            <h2 className="font-display text-[28px] sm:text-[40px] leading-[1.05] tracking-[-0.015em] mt-3 max-w-[600px]">
              Werde Teil des TSV.
            </h2>
            <p className="text-[15px] sm:text-[17px] text-paper-100/80 mt-3 max-w-[480px] mx-auto sm:mx-0 leading-[1.55]">
              Eröffnung am 12. April. Bis dahin sind Schnuppertermine jederzeit kostenlos möglich.
            </p>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <a href="#mitgliedschaft">
              <Button variant="accent" size="lg">
                Mitglied werden
              </Button>
            </a>
            <a href="mailto:office@tsv-treffen.at">
              <Button
                variant="ghost"
                size="lg"
                className="!text-paper-50 hover:!bg-white/10"
              >
                Schnuppern
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-stone-900 text-paper-100/75">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <TSVLockup height={40} color="#FBF8F1" accent="#C39265" />
            <p className="text-[14px] mt-5 leading-[1.6] max-w-md">
              Tennisverein in Treffen am Ossiachersee · Kärnten · Österreich. Sandplatz-Tennis beim
              Schloss, direkt am Treffnerbach, mit Blick auf die Gerlitzen.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper-100/45">
              Verein
            </div>
            <ul className="mt-3 space-y-1.5 text-[14px]">
              <li><a href="#verein">Über uns</a></li>
              <li><a href="#anlage">Anlage</a></li>
              <li><a href="#mannschaften">Mannschaften</a></li>
              <li><a href="#training">Training</a></li>
              <li><a href="#mitgliedschaft">Mitglied werden</a></li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-paper-100/45">
              Mitgliederbereich
            </div>
            <ul className="mt-3 space-y-1.5 text-[14px]">
              <li><Link href="/login">Anmelden</Link></li>
              <li><Link href="/app/dashboard">Dashboard</Link></li>
              <li><Link href="/app/kalender">Kalender</Link></li>
              <li>
                <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer">Platz buchen</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-paper-100/45 gap-4 flex-wrap">
            <span>TSV Schloss Treffen · Saison 2026</span>
            <span className="flex items-center gap-4">
              <Link href="/impressum" className="hover:text-paper-100">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-paper-100">
                Datenschutz
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
