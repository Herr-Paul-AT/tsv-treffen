import { asc, eq, gt, and } from 'drizzle-orm';
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
