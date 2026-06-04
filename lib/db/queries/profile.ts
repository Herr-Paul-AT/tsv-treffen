import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { rawRows } from '@/lib/db/raw';
import { attendances, teamMembers, teams, trainings } from '@/lib/db/schema';

export type ProfileStats = {
  trainingsThisSeason: number;
  attendanceRate: number; // 0..1
  upcomingThisWeek: number;
  recordLabel: string; // placeholder for season win/loss
};

export type ProfileTeam = { name: string; league: string };

export async function getProfileTeams(memberId: string): Promise<ProfileTeam[]> {
  const rows = await db
    .select({ name: teams.name, league: teams.league })
    .from(teamMembers)
    .innerJoin(teams, eq(teams.id, teamMembers.teamId))
    .where(eq(teamMembers.memberId, memberId));
  return rows;
}

export async function getProfileStats(memberId: string): Promise<ProfileStats> {
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const rows = await rawRows<{ total: number; attended: number }>(sql`
    WITH season_trainings AS (
      SELECT t.id FROM trainings t
      JOIN team_members tm ON tm.team_id = t.team_id
      WHERE tm.member_id = ${memberId}
        AND t.starts_at >= ${yearStart.toISOString()}
        AND t.cancelled = false
    ),
    season_yes AS (
      SELECT COUNT(*)::int AS n FROM attendances
      WHERE member_id = ${memberId}
        AND status = 'yes'
        AND training_id IN (SELECT id FROM season_trainings)
    ),
    season_total AS (
      SELECT COUNT(*)::int AS n FROM season_trainings
    )
    SELECT (SELECT n FROM season_total) AS total, (SELECT n FROM season_yes) AS attended
  `);
  const r = rows[0] ?? { total: 0, attended: 0 };

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const upcomingResult = await db
    .select({ id: trainings.id })
    .from(trainings)
    .innerJoin(teamMembers, eq(teamMembers.teamId, trainings.teamId))
    .where(
      and(
        eq(teamMembers.memberId, memberId),
        gte(trainings.startsAt, new Date()),
        eq(trainings.cancelled, false),
      ),
    );
  const upcoming = upcomingResult.filter((t) => true).length;

  return {
    trainingsThisSeason: r.total,
    attendanceRate: r.total > 0 ? r.attended / r.total : 0,
    upcomingThisWeek: upcoming,
    recordLabel: '–',
  };
}

export async function getOpenAttendances(memberId: string) {
  return db
    .select()
    .from(attendances)
    .where(eq(attendances.memberId, memberId));
}
