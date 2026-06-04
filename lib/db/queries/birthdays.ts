import { sql } from 'drizzle-orm';
import { rawRows } from '@/lib/db/raw';
import type { AvatarTone } from '@/components/ui/Avatar';

export type BirthdayEntry = {
  memberId: string;
  name: string;
  initials: string;
  tone: AvatarTone;
  birthdate: Date;
  turning: number;
  daysAway: number;
};

export async function getUpcomingBirthdays(days = 30): Promise<BirthdayEntry[]> {
  const rows = await rawRows<{
    member_id: string;
    first_name: string;
    last_name: string;
    initials: string;
    avatar_tone: string;
    birthdate: string;
    days_away: number;
    turning: number;
  }>(sql`
    WITH base AS (
      SELECT
        id AS member_id, first_name, last_name, initials, avatar_tone, birthdate,
        DATE_PART('year', AGE(birthdate))::int + 1 AS turning,
        (DATE(birthdate) + (DATE_PART('year', AGE(CURRENT_DATE, birthdate))::int + 1) * INTERVAL '1 year')::date AS next_birthday
      FROM members
      WHERE birthdate IS NOT NULL AND status IN ('active','probe')
    )
    SELECT
      member_id, first_name, last_name, initials, avatar_tone, birthdate,
      (next_birthday - CURRENT_DATE)::int AS days_away,
      turning
    FROM base
    WHERE (next_birthday - CURRENT_DATE) BETWEEN 0 AND ${days}
    ORDER BY days_away ASC
  `);
  return rows.map((r) => ({
    memberId: r.member_id,
    name: `${r.first_name} ${r.last_name}`,
    initials: r.initials,
    tone: r.avatar_tone as AvatarTone,
    birthdate: new Date(r.birthdate),
    turning: r.turning,
    daysAway: r.days_away,
  }));
}

export async function getTodaysBirthdays(): Promise<BirthdayEntry[]> {
  return (await getUpcomingBirthdays(0)).filter((b) => b.daysAway === 0);
}
