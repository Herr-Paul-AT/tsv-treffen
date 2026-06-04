import { and, asc, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { rawRows } from '@/lib/db/raw';
import {
  attendances,
  members,
  teamMembers,
  teams,
  trainings,
  type Member,
  type Training,
} from '@/lib/db/schema';

export type TrainingWithMeta = Training & {
  teamName: string | null;
  trainerName: string | null;
  yesCount: number;
  maybeCount: number;
  noCount: number;
  myStatus: 'yes' | 'maybe' | 'no' | null;
};

export async function getNextTrainingForMember(memberId: string): Promise<TrainingWithMeta | null> {
  const rows = await db
    .select({
      training: trainings,
      teamName: teams.name,
      trainerFirst: members.firstName,
      trainerLast: members.lastName,
    })
    .from(trainings)
    .innerJoin(teamMembers, eq(teamMembers.teamId, trainings.teamId))
    .leftJoin(teams, eq(teams.id, trainings.teamId))
    .leftJoin(members, eq(members.id, trainings.trainerId))
    .where(and(eq(teamMembers.memberId, memberId), gte(trainings.startsAt, new Date()), eq(trainings.cancelled, false)))
    .orderBy(asc(trainings.startsAt))
    .limit(1);

  if (!rows[0]) return null;
  const t = rows[0];
  const meta = await getTrainingMeta(t.training.id, memberId);
  return {
    ...t.training,
    teamName: t.teamName,
    trainerName: t.trainerFirst && t.trainerLast ? `${t.trainerFirst} ${t.trainerLast}` : null,
    ...meta,
  };
}

export async function getTrainingMeta(trainingId: string, memberId?: string) {
  const result = await rawRows<{ yes_count: number; maybe_count: number; no_count: number }>(sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'yes')::int AS yes_count,
      COUNT(*) FILTER (WHERE status = 'maybe')::int AS maybe_count,
      COUNT(*) FILTER (WHERE status = 'no')::int AS no_count
    FROM attendances WHERE training_id = ${trainingId}
  `);
  const counts = result[0];

  let myStatus: 'yes' | 'maybe' | 'no' | null = null;
  if (memberId) {
    const my = await db
      .select({ status: attendances.status })
      .from(attendances)
      .where(and(eq(attendances.trainingId, trainingId), eq(attendances.memberId, memberId)))
      .limit(1);
    myStatus = (my[0]?.status as 'yes' | 'maybe' | 'no' | undefined) ?? null;
  }
  return {
    yesCount: counts.yes_count,
    maybeCount: counts.maybe_count,
    noCount: counts.no_count,
    myStatus,
  };
}

export async function getTrainingsInRange(from: Date, to: Date): Promise<TrainingWithMeta[]> {
  const rows = await db
    .select({
      training: trainings,
      teamName: teams.name,
      trainerFirst: members.firstName,
      trainerLast: members.lastName,
    })
    .from(trainings)
    .leftJoin(teams, eq(teams.id, trainings.teamId))
    .leftJoin(members, eq(members.id, trainings.trainerId))
    .where(and(gte(trainings.startsAt, from), lte(trainings.startsAt, to)))
    .orderBy(asc(trainings.startsAt));

  const out: TrainingWithMeta[] = [];
  for (const r of rows) {
    const meta = await getTrainingMeta(r.training.id);
    out.push({
      ...r.training,
      teamName: r.teamName,
      trainerName: r.trainerFirst && r.trainerLast ? `${r.trainerFirst} ${r.trainerLast}` : null,
      ...meta,
    });
  }
  return out;
}

export type TrainingListRow = Training & {
  teamName: string | null;
  trainerName: string | null;
};

/** Alle Trainings für die Admin-Verwaltung — kommende zuerst absteigend nach Datum. */
export async function listTrainingsForManagement(): Promise<TrainingListRow[]> {
  const rows = await db
    .select({
      training: trainings,
      teamName: teams.name,
      trainerFirst: members.firstName,
      trainerLast: members.lastName,
    })
    .from(trainings)
    .leftJoin(teams, eq(teams.id, trainings.teamId))
    .leftJoin(members, eq(members.id, trainings.trainerId))
    .orderBy(desc(trainings.startsAt));

  return rows.map((r) => ({
    ...r.training,
    teamName: r.teamName,
    trainerName:
      r.trainerFirst && r.trainerLast ? `${r.trainerFirst} ${r.trainerLast}` : null,
  }));
}

export type RosterEntry = { member: Member; status: 'yes' | 'maybe' | 'no'; respondedAt: Date };

export async function getTrainingRoster(trainingId: string): Promise<RosterEntry[]> {
  const rows = await db
    .select({ member: members, status: attendances.status, respondedAt: attendances.respondedAt })
    .from(attendances)
    .innerJoin(members, eq(members.id, attendances.memberId))
    .where(eq(attendances.trainingId, trainingId))
    .orderBy(asc(members.lastName));
  return rows.map((r) => ({
    member: r.member,
    status: r.status as 'yes' | 'maybe' | 'no',
    respondedAt: r.respondedAt,
  }));
}

export async function getTrainingById(id: string) {
  const rows = await db
    .select({
      training: trainings,
      teamName: teams.name,
      trainerFirst: members.firstName,
      trainerLast: members.lastName,
    })
    .from(trainings)
    .leftJoin(teams, eq(teams.id, trainings.teamId))
    .leftJoin(members, eq(members.id, trainings.trainerId))
    .where(eq(trainings.id, id))
    .limit(1);
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    ...r.training,
    teamName: r.teamName,
    trainerName: r.trainerFirst && r.trainerLast ? `${r.trainerFirst} ${r.trainerLast}` : null,
  };
}
