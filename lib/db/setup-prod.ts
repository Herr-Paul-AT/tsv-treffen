import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { eq, sql } from 'drizzle-orm';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import type { PgDatabase } from 'drizzle-orm/pg-core';
import * as schema from './schema';
import { parseMembersCsv, initialsFor, toneFor } from '../members-csv';

/**
 * Produktions-Erstbefüllung — NUR saubere Echtdaten, keine Demo-Inhalte.
 * Legt an: Plätze, Mannschaften (leer), echte Mitglieder aus data/mitglieder.csv,
 * sowie eine Admin-Person. Keine Trainings/News/Events/Beiträge/Sponsoren —
 * die entstehen über den Adminbereich.
 *
 * Sicherheitsnetz: bricht ab, wenn bereits Mitglieder vorhanden sind.
 */

const MEMBERS_CSV = path.resolve(process.cwd(), 'data/mitglieder.csv');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'office@martinhofmann.at').toLowerCase();

const COURTS = [
  { name: 'Platz 1', number: 1, floodlight: true },
  { name: 'Platz 2', number: 2, floodlight: true },
  { name: 'Platz 3', number: 3, floodlight: false },
  { name: 'Platz 4', number: 4, floodlight: false },
];

const TEAMS = [
  { name: 'Herren I', league: 'Landesliga Kärnten', sortOrder: 1 },
  { name: 'Herren II', league: 'Bezirksliga Ost', sortOrder: 2 },
  { name: 'Damen 35+', league: 'Bezirksliga Damen', sortOrder: 3 },
  { name: 'Damen 50+', league: 'Senioren-Cup', sortOrder: 4 },
  { name: 'Jugend U10', league: 'Mini-Cup', sortOrder: 5 },
  { name: 'Jugend U12', league: 'Nachwuchs-Cup', sortOrder: 6 },
  { name: 'Jugend U14', league: 'Nachwuchs-Cup', sortOrder: 7 },
  { name: 'Jugend U16', league: 'Bezirks-Cup U16', sortOrder: 8 },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL fehlt — bitte .env.local befüllen (Supabase).');

  const postgres = (await import('postgres')).default;
  const { drizzle } = await import('drizzle-orm/postgres-js');
  const client = postgres(url, { max: 1, prepare: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db: PgDatabase<any, typeof schema> = drizzle(client, { schema });

  // Sicherheitsnetz: nicht über bestehende Daten drüberbügeln.
  const existing = await db.select({ c: sql<number>`count(*)::int` }).from(schema.members);
  if ((existing[0]?.c ?? 0) > 0) {
    console.error(`Abbruch: members enthält bereits ${existing[0].c} Einträge. (Kein Überschreiben.)`);
    await client.end();
    process.exit(1);
  }

  console.log('Plätze anlegen…');
  await db.insert(schema.courts).values(COURTS as never);

  console.log('Mannschaften anlegen (leer)…');
  await db.insert(schema.teams).values(TEAMS as never);

  // Echte Mitglieder aus CSV
  if (!existsSync(MEMBERS_CSV)) {
    console.error('Abbruch: data/mitglieder.csv nicht gefunden.');
    await client.end();
    process.exit(1);
  }
  console.log('Mitglieder importieren…');
  const { rows } = parseMembersCsv(readFileSync(MEMBERS_CSV, 'utf8'));
  const seen = new Set<string>();
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

  // Admin sicherstellen
  console.log(`Admin setzen: ${ADMIN_EMAIL}…`);
  const adminExisting = await db
    .select()
    .from(schema.members)
    .where(eq(schema.members.email, ADMIN_EMAIL))
    .limit(1);
  if (adminExisting[0]) {
    await db.update(schema.members).set({ role: 'admin' }).where(eq(schema.members.email, ADMIN_EMAIL));
  } else {
    await db.insert(schema.members).values({
      firstName: 'Martin',
      lastName: 'Hofmann',
      email: ADMIN_EMAIL,
      initials: 'MH',
      avatarTone: 'lake',
      role: 'admin',
      status: 'active',
      updatedAt: new Date(),
    });
  }

  const total = await db.select({ c: sql<number>`count(*)::int` }).from(schema.members);
  console.log(`Fertig. ${total[0]?.c ?? 0} Mitglieder, ${TEAMS.length} Mannschaften, ${COURTS.length} Plätze. Admin: ${ADMIN_EMAIL}.`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
