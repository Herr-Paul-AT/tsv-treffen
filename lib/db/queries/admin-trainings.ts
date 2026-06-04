import { sql } from 'drizzle-orm';
import { rawRows } from '@/lib/db/raw';

export type TrainingAdminStats = {
  today: number;
  thisWeek: number;
  cancelledThisWeek: number;
  attendanceRate: number | null;
};

export async function getTrainingAdminStats(): Promise<TrainingAdminStats> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const weekStart = new Date(todayStart);
  const day = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - day);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const fourWeeksAgo = new Date(todayStart);
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const rows = await rawRows<{
    today: number;
    week: number;
    cancelled_week: number;
    attendance_rate: string | null;
  }>(sql`
    SELECT
      COUNT(*) FILTER (
        WHERE starts_at >= ${todayStart.toISOString()}
          AND starts_at <  ${todayEnd.toISOString()}
      )::int AS today,
      COUNT(*) FILTER (
        WHERE starts_at >= ${weekStart.toISOString()}
          AND starts_at <  ${weekEnd.toISOString()}
      )::int AS week,
      COUNT(*) FILTER (
        WHERE cancelled = true
          AND starts_at >= ${weekStart.toISOString()}
          AND starts_at <  ${weekEnd.toISOString()}
      )::int AS cancelled_week,
      (
        SELECT ROUND(
          AVG(CASE WHEN a.status = 'yes' THEN 1.0 ELSE 0 END) * 100
        )::text
        FROM attendances a
        JOIN trainings t2 ON t2.id = a.training_id
        WHERE t2.starts_at >= ${fourWeeksAgo.toISOString()}
          AND t2.starts_at < ${todayStart.toISOString()}
      ) AS attendance_rate
    FROM trainings
  `);
  const r = rows[0] ?? { today: 0, week: 0, cancelled_week: 0, attendance_rate: null };
  return {
    today: r.today,
    thisWeek: r.week,
    cancelledThisWeek: r.cancelled_week,
    attendanceRate: r.attendance_rate ? Number(r.attendance_rate) : null,
  };
}

export type AttentionMember = {
  memberId: string;
  initials: string;
  tone: string;
  name: string;
  issue: string;
};

/**
 * Returns members who are on a team but have not RSVP'd to their team's next
 * upcoming training. The cap keeps this cheap.
 */
export async function getMembersNeedingAttention(limit = 5): Promise<AttentionMember[]> {
  const rows = await rawRows<{
    member_id: string;
    initials: string;
    avatar_tone: string;
    first_name: string;
    last_name: string;
    training_title: string;
    starts_at: string;
  }>(sql`
    WITH next_team_training AS (
      SELECT DISTINCT ON (t.team_id)
        t.id AS training_id, t.team_id, t.title, t.starts_at
      FROM trainings t
      WHERE t.team_id IS NOT NULL
        AND t.cancelled = false
        AND t.starts_at >= NOW()
      ORDER BY t.team_id, t.starts_at ASC
    )
    SELECT
      m.id AS member_id, m.initials, m.avatar_tone, m.first_name, m.last_name,
      ntt.title AS training_title, ntt.starts_at AS starts_at
    FROM next_team_training ntt
    JOIN team_members tm ON tm.team_id = ntt.team_id
    JOIN members m ON m.id = tm.member_id
    LEFT JOIN attendances a ON a.training_id = ntt.training_id AND a.member_id = m.id
    WHERE a.member_id IS NULL
      AND m.status = 'active'
    ORDER BY ntt.starts_at ASC, m.last_name ASC
    LIMIT ${limit}
  `);
  return rows.map((r) => ({
    memberId: r.member_id,
    initials: r.initials,
    tone: r.avatar_tone,
    name: `${r.first_name} ${r.last_name}`,
    issue: `Keine Rückmeldung zu ${r.training_title}`,
  }));
}
