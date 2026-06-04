import { sql } from 'drizzle-orm';
import { rawRows } from '@/lib/db/raw';

export type ClubStats = {
  courts: number;
  members: number;
  teams: number;
};

export async function getClubStats(): Promise<ClubStats> {
  const rows = await rawRows<{ courts: number; members: number; teams: number }>(sql`
    SELECT
      (SELECT COUNT(*) FROM courts WHERE active = true)::int AS courts,
      (SELECT COUNT(*) FROM members WHERE status IN ('active','probe'))::int AS members,
      (SELECT COUNT(*) FROM teams WHERE active = true)::int AS teams
  `);
  return rows[0] ?? { courts: 0, members: 0, teams: 0 };
}
