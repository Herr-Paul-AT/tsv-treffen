import { asc, eq, gt, and, notInArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { events, members, teamMembers, teams, type Team } from '@/lib/db/schema';
import type { AvatarTone } from '@/components/ui/Avatar';

export type TeamWithRoster = Team & {
  trainerName: string | null;
  roster: { initials: string; tone: AvatarTone; memberId: string; name: string }[];
  nextEventLabel: string | null;
};

export async function listTeamsWithRoster(): Promise<TeamWithRoster[]> {
  const teamRows = await db
    .select({
      team: teams,
      trainerFirst: members.firstName,
      trainerLast: members.lastName,
    })
    .from(teams)
    .leftJoin(members, eq(members.id, teams.trainerId))
    .orderBy(asc(teams.sortOrder), asc(teams.name));

  const rosterRows = await db
    .select({
      teamId: teamMembers.teamId,
      memberId: members.id,
      firstName: members.firstName,
      lastName: members.lastName,
      initials: members.initials,
      avatarTone: members.avatarTone,
    })
    .from(teamMembers)
    .innerJoin(members, eq(members.id, teamMembers.memberId))
    .orderBy(asc(members.lastName));

  const rosterByTeam = new Map<string, TeamWithRoster['roster']>();
  for (const r of rosterRows) {
    const list = rosterByTeam.get(r.teamId) ?? [];
    list.push({
      memberId: r.memberId,
      initials: r.initials,
      tone: r.avatarTone as AvatarTone,
      name: `${r.firstName} ${r.lastName}`,
    });
    rosterByTeam.set(r.teamId, list);
  }

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(and(gt(events.startsAt, new Date()), eq(events.kind, 'match')))
    .orderBy(asc(events.startsAt));

  return teamRows.map((r) => {
    const roster = rosterByTeam.get(r.team.id) ?? [];
    const trainerName = r.trainerFirst && r.trainerLast
      ? `${r.trainerFirst[0]}. ${r.trainerLast}`
      : null;

    // Heuristic: pick next match whose title mentions this team's name.
    const next = upcomingEvents.find((e) => e.title.toLowerCase().includes(r.team.name.toLowerCase()));
    const nextLabel = next
      ? `${weekdayDe(next.startsAt)} ${next.startsAt.getDate()}.${next.startsAt.getMonth() + 1}. · ${next.location ?? next.title}`
      : null;

    return {
      ...r.team,
      trainerName,
      roster,
      nextEventLabel: nextLabel,
    };
  });
}

function weekdayDe(d: Date) {
  return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()];
}

/** Schlanke Team-Liste für Auswahlfelder (Trainings, Zuordnungen). */
export async function listTeamOptions(): Promise<{ id: string; name: string }[]> {
  return db
    .select({ id: teams.id, name: teams.name })
    .from(teams)
    .orderBy(asc(teams.sortOrder), asc(teams.name));
}

export async function getTeam(id: string): Promise<Team | null> {
  const rows = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return rows[0] ?? null;
}

export type TeamRosterEntry = {
  memberId: string;
  name: string;
  initials: string;
  tone: AvatarTone;
  role: 'player' | 'captain' | 'reserve';
  lkRating: string | null;
};

/** Kader eines Teams — Kapitän zuerst, dann nach Namen. */
export async function getTeamRoster(teamId: string): Promise<TeamRosterEntry[]> {
  const rows = await db
    .select({
      memberId: members.id,
      firstName: members.firstName,
      lastName: members.lastName,
      initials: members.initials,
      tone: members.avatarTone,
      role: teamMembers.role,
      lkRating: members.lkRating,
    })
    .from(teamMembers)
    .innerJoin(members, eq(members.id, teamMembers.memberId))
    .where(eq(teamMembers.teamId, teamId))
    .orderBy(asc(members.lastName), asc(members.firstName));

  const order = { captain: 0, player: 1, reserve: 2 } as const;
  return rows
    .map((r) => ({
      memberId: r.memberId,
      name: `${r.firstName} ${r.lastName}`,
      initials: r.initials,
      tone: r.tone as AvatarTone,
      role: r.role as 'player' | 'captain' | 'reserve',
      lkRating: r.lkRating,
    }))
    .sort((a, b) => order[a.role] - order[b.role]);
}

/** Mitglieder, die noch NICHT in diesem Team sind — für die Kader-Auswahl. */
export async function listMembersNotInTeam(teamId: string): Promise<{ id: string; name: string }[]> {
  const inTeam = db
    .select({ id: teamMembers.memberId })
    .from(teamMembers)
    .where(eq(teamMembers.teamId, teamId));

  const rows = await db
    .select({ id: members.id, firstName: members.firstName, lastName: members.lastName })
    .from(members)
    .where(notInArray(members.id, inTeam))
    .orderBy(asc(members.lastName), asc(members.firstName));
  return rows.map((r) => ({ id: r.id, name: `${r.firstName} ${r.lastName}` }));
}

/** Wie viele Mitglieder sind (noch) keinem Team zugeordnet? */
export async function getUnassignedMemberCount(): Promise<number> {
  const assigned = db.selectDistinct({ id: teamMembers.memberId }).from(teamMembers);
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(members)
    .where(notInArray(members.id, assigned));
  return rows[0]?.count ?? 0;
}
