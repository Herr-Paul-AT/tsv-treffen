import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import { parseMembersCsv, initialsFor, toneFor } from '../members-csv';

const dataDir = process.env.PGLITE_DATA_DIR ?? './data/pglite';
const MEMBERS_CSV = path.resolve(process.cwd(), 'data/mitglieder.csv');

const MEMBERS = [
  { email: 'm.hofmann@tsv-treffen.at', firstName: 'Martin', lastName: 'Hofmann', initials: 'MH', avatarTone: 'lake', role: 'obmann', status: 'active', memberSince: '2014-04-01', lkRating: '11.3', paymentStatus: 'paid', birthdate: '1984-05-28', phone: '+43 660 1234567', category: 'aktiv' },
  { email: 'k.wallner@tsv-treffen.at', firstName: 'Katharina', lastName: 'Wallner', initials: 'KW', avatarTone: 'sand', role: 'jugendleiter', status: 'active', memberSince: '2018-04-01', lkRating: '9.7', paymentStatus: 'paid', birthdate: '1979-05-26', phone: '+43 660 2345678', category: 'aktiv' },
  { email: 'j.steiner@gmail.com', firstName: 'Julian', lastName: 'Steiner', initials: 'JS', avatarTone: 'forest', role: 'member', status: 'active', memberSince: '2021-04-01', lkRating: '14.1', paymentStatus: 'paid', birthdate: '1996-08-12', phone: '+43 660 3456789', category: 'aktiv' },
  { email: 'a.brunner@tsv-treffen.at', firstName: 'Anna', lastName: 'Brunner', initials: 'AB', avatarTone: 'stone', role: 'trainer', status: 'active', memberSince: '2019-04-01', lkRating: null, paymentStatus: 'paid', birthdate: '1991-11-03', phone: '+43 660 4567890', category: 'aktiv' },
  { email: 'leon.pirker@web.at', firstName: 'Leon', lastName: 'Pirker', initials: 'LP', avatarTone: 'lake', role: 'member', status: 'paused', memberSince: '2017-04-01', lkRating: '7.4', paymentStatus: 'open', paymentDueCents: 28000, birthdate: '1988-02-14', category: 'aktiv' },
  { email: 'evam.rauter@gmx.at', firstName: 'Eva Maria', lastName: 'Rauter', initials: 'EM', avatarTone: 'sand', role: 'member', status: 'active', memberSince: '2022-04-01', lkRating: '12.8', paymentStatus: 'paid', birthdate: '1985-05-30', category: 'aktiv' },
  { email: 't.wieser@tsv-treffen.at', firstName: 'Tobias', lastName: 'Wieser', initials: 'TW', avatarTone: 'forest', role: 'member', status: 'probe', memberSince: '2026-04-01', lkRating: '15.0', paymentStatus: 'partial', paymentDueCents: 14000, birthdate: '2001-09-08', category: 'aktiv' },
  { email: 'r.steiner@aon.at', firstName: 'Renate', lastName: 'Steiner', initials: 'RS', avatarTone: 'stone', role: 'member', status: 'active', memberSince: '2009-04-01', lkRating: '13.2', paymentStatus: 'paid', birthdate: '1968-06-02', category: 'aktiv' },
  { email: 'gp@pucher-bau.at', firstName: 'Gregor', lastName: 'Pucher', initials: 'GP', avatarTone: 'lake', role: 'admin', status: 'active', memberSince: '2003-04-01', lkRating: null, paymentStatus: 'waived', birthdate: '1955-10-22', category: 'ehren' },
  { email: 'n.koefer@tsv-treffen.at', firstName: 'Nina', lastName: 'Köfer', initials: 'NK', avatarTone: 'sand', role: 'member', status: 'active', memberSince: '2024-04-01', lkRating: '14.6', paymentStatus: 'paid', birthdate: '2010-05-25', category: 'jugend' },
  { email: 'm.pirker@tsv-treffen.at', firstName: 'Markus', lastName: 'Pirker', initials: 'MP', avatarTone: 'stone', role: 'trainer', status: 'active', memberSince: '2010-04-01', lkRating: '8.2', paymentStatus: 'paid', birthdate: '1978-03-15', phone: '+43 660 5678901', category: 'aktiv' },
] as const;

type CategoryKey = 'jugend' | 'aktiv' | 'familie' | 'ehren';

const DUES_2026 = [
  { category: 'jugend', amountCents: 12000, dueDate: '2026-04-30' },
  { category: 'aktiv', amountCents: 28000, dueDate: '2026-04-30' },
  { category: 'familie', amountCents: 48000, dueDate: '2026-04-30' },
  { category: 'ehren', amountCents: 0, dueDate: '2026-04-30' },
] as const;

const TEAMS = [
  { name: 'Herren I', league: 'Landesliga Kärnten', trainerEmail: 'm.pirker@tsv-treffen.at', sortOrder: 1, record: '3 : 1' },
  { name: 'Herren II', league: 'Bezirksliga Ost', trainerEmail: 'm.pirker@tsv-treffen.at', sortOrder: 2, record: '4 : 0' },
  { name: 'Damen 35+', league: 'Bezirksliga Damen', trainerEmail: 'k.wallner@tsv-treffen.at', sortOrder: 3, record: '2 : 1' },
  { name: 'Damen 50+', league: 'Senioren-Cup', trainerEmail: 'k.wallner@tsv-treffen.at', sortOrder: 4 },
  { name: 'Jugend U10', league: 'Mini-Cup', trainerEmail: 'a.brunner@tsv-treffen.at', sortOrder: 5 },
  { name: 'Jugend U12', league: 'Nachwuchs-Cup', trainerEmail: 'a.brunner@tsv-treffen.at', sortOrder: 6 },
  { name: 'Jugend U14', league: 'Nachwuchs-Cup', trainerEmail: 'm.pirker@tsv-treffen.at', sortOrder: 7 },
  { name: 'Jugend U16', league: 'Bezirks-Cup U16', trainerEmail: 'm.pirker@tsv-treffen.at', sortOrder: 8 },
] as const;

const TEAM_MEMBERSHIPS: Record<string, string[]> = {
  'Herren I': ['leon.pirker@web.at', 'gp@pucher-bau.at'],
  'Herren II': ['m.hofmann@tsv-treffen.at', 'j.steiner@gmail.com', 't.wieser@tsv-treffen.at'],
  'Damen 35+': ['k.wallner@tsv-treffen.at', 'evam.rauter@gmx.at'],
  'Damen 50+': ['r.steiner@aon.at'],
  'Jugend U12': ['a.brunner@tsv-treffen.at'],
  'Jugend U16': ['n.koefer@tsv-treffen.at'],
};

const COURTS = [
  { name: 'Platz 1', number: 1, floodlight: true },
  { name: 'Platz 2', number: 2, floodlight: true },
  { name: 'Platz 3', number: 3, floodlight: false },
  { name: 'Platz 4', number: 4, floodlight: false },
] as const;

const SPONSORS = [
  { name: 'Raiffeisen Treffen', tier: 'gold', sortOrder: 1 },
  { name: 'Gerlitzen Bergbahn', tier: 'gold', sortOrder: 2 },
  { name: 'Seestern Marina', tier: 'silver', sortOrder: 3 },
  { name: 'Brauerei Hirt', tier: 'silver', sortOrder: 4 },
  { name: 'Wirt am See', tier: 'bronze', sortOrder: 5 },
  { name: 'Gemeinde Treffen', tier: 'standard', sortOrder: 6 },
] as const;

const EVENTS = [
  { title: 'Saisoneröffnung im Schlosshof', kind: 'event', date: '2026-04-12T10:00:00+02:00', location: 'Schlosshof' },
  { title: 'Start Bezirksliga Ost · Herren II', kind: 'match', date: '2026-04-14T16:00:00+02:00', location: 'Heimplatz' },
  { title: 'Doppel-Wochenende · Bezirksliga', kind: 'match', date: '2026-05-15T09:00:00+02:00', endDate: '2026-05-17T18:00:00+02:00' },
  { title: 'Sommerfest im Schlosshof', kind: 'event', date: '2026-06-21T17:00:00+02:00', location: 'Schlosshof' },
  { title: 'Vereinsmeisterschaft Einzel', kind: 'tournament', date: '2026-07-05T09:00:00+02:00', endDate: '2026-07-07T18:00:00+02:00' },
  { title: 'Vereinsmeisterschaft Doppel & Mixed', kind: 'tournament', date: '2026-08-10T09:00:00+02:00', endDate: '2026-08-17T18:00:00+02:00' },
  { title: 'Tag der offenen Tür · gratis schnuppern', kind: 'event', date: '2026-09-12T10:00:00+02:00' },
  { title: 'Saisonabschluss mit Grillerei', kind: 'event', date: '2026-10-05T15:00:00+02:00' },
] as const;

const NEWS = [
  {
    slug: 'saisonstart-2026',
    title: 'Saisonstart 2026 am 12. April mit Eröffnungsdoppel',
    eyebrow: 'Saisoneröffnung',
    eyebrowTone: 'text-sand-700',
    excerpt: 'Auftakt mit dem traditionellen Eröffnungsdoppel im Schlosshof — anschließend gemeinsamer Empfang mit Sektempfang.',
    body: 'Die Saison 2026 startet am Samstag, dem 12. April mit dem traditionellen Eröffnungsdoppel im Schlosshof. Beginn ist um 10 Uhr, eingeladen sind alle Mitglieder und Gäste.\n\nNach dem Eröffnungsdoppel folgt ein gemeinsamer Empfang mit Sektempfang und kleinem Imbiss. Wer mitspielen möchte, meldet sich bis 5. April beim Vorstand.\n\nAb 14. April öffnen die Plätze regulär — Trainingszeiten und Mannschaftsspiele entnehmt ihr dem Kalender im Mitgliederbereich.',
    imageKind: 'sand',
    pinned: true,
    authorEmail: 'm.pirker@tsv-treffen.at',
    publishedAt: '2026-03-04T10:00:00+01:00',
  },
  {
    slug: 'herren-ii-villach',
    title: 'Herren II startet 5:1 in die Bezirksliga',
    eyebrow: 'Mannschaftsspiel',
    eyebrowTone: 'text-lake-700',
    excerpt: 'Souveräner Saisonauftakt gegen Villach in der Bezirksliga Ost. Doppel-Punkt entschied das knappe Match auf Platz 1.',
    body: 'Souveräner Auftakt: Die Herren II haben das erste Bezirksliga-Spiel der Saison mit 5:1 gegen Villach gewonnen. Auf Platz 1 entschied das Doppel ein knappes Match im Tiebreak.\n\nNächstes Heimspiel ist am Samstag, 17. Mai gegen Velden. Anpfiff 14 Uhr — Zuschauer:innen sind herzlich willkommen.',
    imageKind: 'lake',
    pinned: false,
    authorEmail: 'j.steiner@gmail.com',
    publishedAt: '2026-05-22T18:30:00+02:00',
  },
  {
    slug: 'vereinsmeisterschaft-2026',
    title: 'Vereinsmeisterschaft 2026 — Anmeldung offen',
    eyebrow: 'Vereinsmeisterschaft',
    eyebrowTone: 'text-sand-700',
    excerpt: 'Vier Klassen, drei Wochenenden. Anmeldeschluss ist der 15. Mai, Auslosung am Vereinsabend.',
    body: 'Die Vereinsmeisterschaft 2026 läuft von Anfang Juli bis Mitte August. Vier Klassen (Herren Einzel, Damen Einzel, Doppel, Mixed) — Anmeldeschluss ist der 15. Mai 2026.\n\nDie Auslosung findet beim Vereinsabend am 22. Mai im Vereinsheim statt. Anmeldung über das Anmeldeformular im Vereinsheim oder per Mail an office@tsv-treffen.at.',
    imageKind: 'sand',
    pinned: false,
    authorEmail: 'k.wallner@tsv-treffen.at',
    publishedAt: '2026-02-28T12:00:00+01:00',
  },
] as const;

const DOCUMENTS = [
  { title: 'Vereinsstatuten TSV Schloss Treffen', description: 'Aktuelle Statuten in der Fassung der Jahreshauptversammlung 2024.', category: 'statuten', fileUrl: '/docs/statuten-2024.pdf', fileSize: 280_000, pinned: true, validFrom: '2024-03-15' },
  { title: 'Beitragsordnung 2026', description: 'Jahresbeiträge nach Kategorie, Stichtage und Zahlungsmodalitäten.', category: 'beitraege', fileUrl: '/docs/beitragsordnung-2026.pdf', fileSize: 92_000, pinned: true, validFrom: '2026-01-01', validUntil: '2026-12-31' },
  { title: 'Protokoll Jahreshauptversammlung 2025', description: 'Beschlüsse, Wahlergebnisse, Berichte.', category: 'protokoll', fileUrl: '/docs/jhv-2025.pdf', fileSize: 410_000 },
  { title: 'Spielordnung & Hausregeln', description: 'Verhalten auf der Anlage, Buchungsregeln, Etikette.', category: 'spielregeln', fileUrl: '/docs/spielordnung.pdf', fileSize: 56_000 },
  { title: 'Aufnahmeantrag (Neumitglied)', description: 'Antrag inkl. SEPA-Mandat — ausfüllen, unterschreiben, ins Vereinsheim oder per Mail.', category: 'formular', fileUrl: '/docs/aufnahmeantrag.pdf', fileSize: 78_000 },
  { title: 'Datenschutzerklärung Vereinsapp', description: 'Wer hat welchen Zugriff, was wird gespeichert.', category: 'sonstiges', fileUrl: '/docs/datenschutz.pdf', fileSize: 64_000 },
] as const;

const NEWSLETTERS = [
  {
    subject: 'Saisonstart 2026 — alles wichtige in einer Mail',
    body: 'Liebe Mitglieder,\n\nam Samstag 12. April geht\'s los — Eröffnungsdoppel ab 10 Uhr, danach Sektempfang im Schlosshof. Trainingsplan und Mannschaftsaufstellung findet ihr in der App.\n\nBis bald am Platz!\nMartin',
    audience: 'active' as const,
    status: 'sent' as const,
    sentAt: '2026-04-05T09:00:00+02:00',
    recipientCount: 171,
    authorEmail: 'm.hofmann@tsv-treffen.at',
  },
  {
    subject: 'Vereinsabend & Auslosung Vereinsmeisterschaft — 22. Mai',
    body: 'Liebe Aktivmitglieder,\n\nam 22. Mai treffen wir uns ab 18 Uhr im Vereinsheim. Auslosung der Vereinsmeisterschaft, kleine Vorschau auf den Sommer und ein gemeinsames Essen.\n\nUm Anmeldung wird gebeten.',
    audience: 'active' as const,
    status: 'sent' as const,
    sentAt: '2026-05-15T17:00:00+02:00',
    recipientCount: 156,
    authorEmail: 'k.wallner@tsv-treffen.at',
  },
  {
    subject: 'Erinnerung Mitgliedsbeitrag 2026',
    body: 'Liebe Mitglieder,\n\nfür einige steht der Beitrag 2026 noch offen. Bitte um Überweisung bis Ende Mai, sonst pausieren wir die Spielberechtigung.\n\nFragen? Schreibt mir kurz.\nGregor',
    audience: 'custom' as const,
    status: 'draft' as const,
    recipientCount: 0,
    authorEmail: 'gp@pucher-bau.at',
  },
] as const;

function nextMonday(from: Date) {
  const d = new Date(from);
  const day = d.getDay();
  const diff = (8 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function trainingsForWeek(baseMonday: Date, teamId: (name: string) => string | null, trainerId: (email: string) => string | null) {
  const at = (dayOffset: number, hour: number, minute = 0) => {
    const d = new Date(baseMonday);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  };
  return [
    { teamName: 'Damen 35+', title: 'Damentraining 35+/50+', startsAt: at(0, 17, 0), endsAt: at(0, 18, 30), court: 'Platz 3', trainerEmail: 'k.wallner@tsv-treffen.at', maxAttendees: 8 },
    { teamName: 'Jugend U14', title: 'Jugend U14/U16', startsAt: at(1, 16, 30), endsAt: at(1, 18, 0), court: 'Platz 2 & 4', trainerEmail: 'm.pirker@tsv-treffen.at', maxAttendees: 10 },
    { teamName: 'Herren I', title: 'Mannschaftstraining Herren I', startsAt: at(1, 19, 0), endsAt: at(1, 21, 0), court: 'Platz 1 & 2', trainerEmail: 'm.pirker@tsv-treffen.at', maxAttendees: 8 },
    { teamName: 'Jugend U10', title: 'Jugend U10/U12', startsAt: at(2, 14, 30), endsAt: at(2, 16, 30), court: 'Platz 4', trainerEmail: 'a.brunner@tsv-treffen.at', maxAttendees: 8 },
    { teamName: 'Herren II', title: 'Mannschaftstraining Herren II', startsAt: at(2, 18, 0), endsAt: at(2, 20, 0), court: 'Platz 1 & 2', trainerEmail: 'm.pirker@tsv-treffen.at', maxAttendees: 8 },
    { teamName: 'Jugend U14', title: 'Jugend U14/U16', startsAt: at(3, 16, 30), endsAt: at(3, 18, 0), court: 'Platz 2 & 4', trainerEmail: 'm.pirker@tsv-treffen.at', maxAttendees: 10 },
    { teamName: 'Herren I', title: 'Mannschaftstraining Herren I', startsAt: at(3, 19, 0), endsAt: at(3, 21, 0), court: 'Platz 1 & 2', trainerEmail: 'm.pirker@tsv-treffen.at', maxAttendees: 8 },
  ].map((t) => ({
    teamId: teamId(t.teamName),
    title: t.title,
    startsAt: t.startsAt,
    endsAt: t.endsAt,
    court: t.court,
    trainerId: trainerId(t.trainerEmail),
    maxAttendees: t.maxAttendees,
  }));
}

async function main() {
  const client = new PGlite(dataDir);
  const db = drizzle(client, { schema });

  console.log('Truncating existing data…');
  await db.execute(sql`
    TRUNCATE TABLE
      attendances, news_reactions, comments, trainings, news,
      team_members, teams, members, events, sponsors, courts,
      documents, newsletters, dues_invoices, dues_periods
    RESTART IDENTITY CASCADE
  `);

  console.log('Seeding members…');
  const memberRows = await db
    .insert(schema.members)
    .values(MEMBERS.map(({ category: _c, ...m }) => m as never))
    .returning();
  const memberByEmail = new Map(memberRows.map((m) => [m.email, m]));
  const categoryByEmail = new Map<string, CategoryKey>(
    MEMBERS.map((m) => [m.email, m.category as CategoryKey]),
  );

  console.log('Seeding courts…');
  await db.insert(schema.courts).values(COURTS as never);

  console.log('Seeding sponsors…');
  await db.insert(schema.sponsors).values(SPONSORS as never);

  console.log('Seeding teams…');
  const teamRows = await db
    .insert(schema.teams)
    .values(
      TEAMS.map((t) => ({
        name: t.name,
        league: t.league,
        trainerId: memberByEmail.get(t.trainerEmail)?.id ?? null,
        sortOrder: t.sortOrder,
        record: 'record' in t ? t.record : null,
      })),
    )
    .returning();
  const teamByName = new Map(teamRows.map((t) => [t.name, t]));

  console.log('Seeding team memberships…');
  const tmRows: { teamId: string; memberId: string; role: 'player' | 'captain' | 'reserve' }[] = [];
  for (const [teamName, emails] of Object.entries(TEAM_MEMBERSHIPS)) {
    const team = teamByName.get(teamName);
    if (!team) continue;
    for (const email of emails) {
      const m = memberByEmail.get(email);
      if (!m) continue;
      tmRows.push({ teamId: team.id, memberId: m.id, role: 'player' });
    }
  }
  if (tmRows.length) await db.insert(schema.teamMembers).values(tmRows);

  console.log('Seeding events…');
  await db.insert(schema.events).values(
    EVENTS.map((e) => ({
      title: e.title,
      kind: e.kind,
      startsAt: new Date(e.date),
      endsAt: 'endDate' in e ? new Date(e.endDate) : null,
      location: 'location' in e ? e.location : null,
    })),
  );

  console.log('Seeding news…');
  await db.insert(schema.news).values(
    NEWS.map((n) => ({
      slug: n.slug,
      title: n.title,
      eyebrow: n.eyebrow,
      eyebrowTone: n.eyebrowTone,
      excerpt: n.excerpt,
      body: n.body,
      imageKind: n.imageKind,
      pinned: n.pinned,
      authorId: memberByEmail.get(n.authorEmail)?.id ?? null,
      publishedAt: new Date(n.publishedAt),
    })),
  );

  console.log('Seeding documents…');
  await db.insert(schema.documents).values(
    DOCUMENTS.map((d) => ({
      title: d.title,
      description: d.description,
      category: d.category,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
      pinned: 'pinned' in d ? d.pinned : false,
      validFrom: 'validFrom' in d ? d.validFrom : null,
      validUntil: 'validUntil' in d ? d.validUntil : null,
      uploadedBy: memberByEmail.get('m.hofmann@tsv-treffen.at')?.id ?? null,
    })),
  );

  console.log('Seeding newsletters…');
  await db.insert(schema.newsletters).values(
    NEWSLETTERS.map((n) => ({
      subject: n.subject,
      body: n.body,
      audience: n.audience,
      status: n.status,
      authorId: memberByEmail.get(n.authorEmail)?.id ?? null,
      recipientCount: n.recipientCount,
      sentAt: 'sentAt' in n && n.sentAt ? new Date(n.sentAt) : null,
    })),
  );

  console.log('Seeding dues 2026…');
  const duesPeriodRows = await db
    .insert(schema.duesPeriods)
    .values(DUES_2026.map((d) => ({ year: 2026, category: d.category, amountCents: d.amountCents, dueDate: d.dueDate })))
    .returning();
  const duesByCategory = new Map(duesPeriodRows.map((d) => [d.category, d]));

  console.log('Seeding dues invoices…');
  const invoiceRows: (typeof schema.duesInvoices.$inferInsert)[] = [];
  let invoiceCounter = 100;
  for (const m of memberRows) {
    const cat = m.email ? categoryByEmail.get(m.email) : undefined;
    if (!cat) continue;
    const period = duesByCategory.get(cat);
    if (!period || period.amountCents === 0) continue;
    const status = m.paymentStatus;
    const paidCents =
      status === 'paid' ? period.amountCents : status === 'partial' ? Math.floor(period.amountCents / 2) : 0;
    invoiceRows.push({
      memberId: m.id,
      duesPeriodId: period.id,
      amountCents: period.amountCents,
      paidCents,
      status,
      invoiceNumber: `2026-${String(invoiceCounter++).padStart(4, '0')}`,
      issuedAt: new Date('2026-04-01T08:00:00+02:00'),
      dueDate: period.dueDate,
      paidAt: status === 'paid' ? new Date('2026-04-15T08:00:00+02:00') : null,
      remindedAt: status === 'open' ? new Date('2026-05-10T08:00:00+02:00') : null,
    });
  }
  if (invoiceRows.length) await db.insert(schema.duesInvoices).values(invoiceRows);

  console.log('Seeding trainings (current + next 2 weeks)…');
  const now = new Date();
  const week0 = startOfWeek(now);
  const week1 = new Date(week0); week1.setDate(week1.getDate() + 7);
  const week2 = new Date(week0); week2.setDate(week2.getDate() + 14);
  const trainings = [
    ...trainingsForWeek(week0, (n) => teamByName.get(n)?.id ?? null, (e) => memberByEmail.get(e)?.id ?? null),
    ...trainingsForWeek(week1, (n) => teamByName.get(n)?.id ?? null, (e) => memberByEmail.get(e)?.id ?? null),
    ...trainingsForWeek(week2, (n) => teamByName.get(n)?.id ?? null, (e) => memberByEmail.get(e)?.id ?? null),
  ];
  const trainingRows = await db.insert(schema.trainings).values(trainings).returning();

  console.log('Seeding sample attendances for upcoming Herren II trainings…');
  const herrenII = teamByName.get('Herren II');
  if (herrenII) {
    const upcomingHerrenII = trainingRows
      .filter((t) => t.teamId === herrenII.id && t.startsAt > new Date())
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice(0, 2);
    const memberEmails = ['m.hofmann@tsv-treffen.at', 'j.steiner@gmail.com', 't.wieser@tsv-treffen.at'];
    const rows: (typeof schema.attendances.$inferInsert)[] = [];
    for (const training of upcomingHerrenII) {
      memberEmails.forEach((e, i) => {
        const m = memberByEmail.get(e);
        if (!m) return;
        rows.push({
          trainingId: training.id,
          memberId: m.id,
          status: (['yes', 'yes', 'maybe'] as const)[i],
        });
      });
    }
    if (rows.length) await db.insert(schema.attendances).values(rows);
  }

  // Also: some past attendance data so admin stats have something to average.
  console.log('Seeding historical attendance for previous trainings (admin stats)…');
  const pastTrainings = trainingRows.filter((t) => t.startsAt < now).slice(0, 6);
  for (const training of pastTrainings) {
    const sample = memberRows.slice(0, 6).map((m, i) => ({
      trainingId: training.id,
      memberId: m.id,
      status: (i % 4 === 3 ? 'no' : i % 3 === 2 ? 'maybe' : 'yes') as 'yes' | 'maybe' | 'no',
    }));
    await db.insert(schema.attendances).values(sample);
  }

  // Optionaler Import echter Mitglieder aus data/mitglieder.csv (gitignored).
  // Duplikat-E-Mails werden genullt, damit alle Personen angelegt werden.
  let importedReal = 0;
  if (existsSync(MEMBERS_CSV)) {
    console.log('Importing real members from data/mitglieder.csv…');
    const { rows } = parseMembersCsv(readFileSync(MEMBERS_CSV, 'utf8'));
    const seen = new Set<string>(MEMBERS.map((m) => m.email.toLowerCase()));
    const toInsert: (typeof schema.members.$inferInsert)[] = [];
    for (const r of rows) {
      if (!r.valid) continue;
      let email: string | null = r.email;
      if (email && seen.has(email)) email = null;
      if (email) seen.add(email);
      toInsert.push({
        firstName: r.firstName,
        lastName: r.lastName,
        email,
        initials: initialsFor(r.firstName, r.lastName),
        avatarTone: toneFor(email || `${r.firstName} ${r.lastName}`),
        role: r.role,
        status: r.status,
        phone: r.phone,
        street: r.street,
        postalCode: r.postalCode,
        city: r.city,
        birthdate: r.birthdate,
        lkRating: r.lkRating,
        updatedAt: new Date(),
      });
    }
    if (toInsert.length) await db.insert(schema.members).values(toInsert);
    importedReal = toInsert.length;
  }

  console.log(
    `Done. ${memberRows.length + importedReal} members (${importedReal} aus CSV), ${teamRows.length} teams, ${trainingRows.length} trainings, ${invoiceRows.length} invoices.`,
  );
  await client.close();
}

function startOfWeek(d: Date) {
  const out = new Date(d);
  const day = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - day);
  out.setHours(0, 0, 0, 0);
  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
