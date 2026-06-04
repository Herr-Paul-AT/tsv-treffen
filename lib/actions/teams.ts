'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { teamMembers, teams } from '@/lib/db/schema';

const TEAM_ROLES = ['player', 'captain', 'reserve'] as const;
type TeamRole = (typeof TEAM_ROLES)[number];

function revalidateTeamViews(teamId?: string) {
  revalidatePath('/admin/mannschaften');
  revalidatePath('/admin');
  revalidatePath('/');
  if (teamId) revalidatePath(`/admin/mannschaften/${teamId}`);
}

function parseTeamForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const league = String(formData.get('league') ?? '').trim();
  if (!name) throw new Error('Name ist erforderlich.');
  if (!league) throw new Error('Liga / Spielklasse ist erforderlich.');

  const trainerId = String(formData.get('trainerId') ?? '').trim() || null;
  const record = String(formData.get('record') ?? '').trim() || null;
  const active = formData.get('active') === 'on';
  const sortRaw = String(formData.get('sortOrder') ?? '').trim();
  const sortOrder = sortRaw && /^\d+$/.test(sortRaw) ? Number(sortRaw) : 0;

  return { name, league, trainerId, record, active, sortOrder };
}

export async function createTeam(formData: FormData) {
  const values = parseTeamForm(formData);
  const [row] = await db.insert(teams).values(values).returning();
  revalidateTeamViews(row.id);
  redirect(`/admin/mannschaften/${row.id}`);
}

export async function updateTeam(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Team-ID fehlt.');
  const values = parseTeamForm(formData);
  await db.update(teams).set(values).where(eq(teams.id, id));
  revalidateTeamViews(id);
  redirect('/admin/mannschaften');
}

export async function deleteTeam(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Team-ID fehlt.');
  await db.delete(teams).where(eq(teams.id, id));
  revalidateTeamViews(id);
  redirect('/admin/mannschaften');
}

// --- Kader ---

export async function addMemberToTeam(formData: FormData) {
  const teamId = String(formData.get('teamId') ?? '').trim();
  const memberId = String(formData.get('memberId') ?? '').trim();
  if (!teamId || !memberId) throw new Error('Team und Mitglied sind erforderlich.');
  const roleRaw = String(formData.get('role') ?? 'player');
  const role: TeamRole = (TEAM_ROLES as readonly string[]).includes(roleRaw)
    ? (roleRaw as TeamRole)
    : 'player';

  await db.insert(teamMembers).values({ teamId, memberId, role }).onConflictDoNothing();
  revalidateTeamViews(teamId);
  redirect(`/admin/mannschaften/${teamId}`);
}

export async function setTeamMemberRole(formData: FormData) {
  const teamId = String(formData.get('teamId') ?? '').trim();
  const memberId = String(formData.get('memberId') ?? '').trim();
  const roleRaw = String(formData.get('role') ?? 'player');
  if (!teamId || !memberId) throw new Error('Team und Mitglied sind erforderlich.');
  const role: TeamRole = (TEAM_ROLES as readonly string[]).includes(roleRaw)
    ? (roleRaw as TeamRole)
    : 'player';

  await db
    .update(teamMembers)
    .set({ role })
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.memberId, memberId)));
  revalidateTeamViews(teamId);
  redirect(`/admin/mannschaften/${teamId}`);
}

export async function removeMemberFromTeam(formData: FormData) {
  const teamId = String(formData.get('teamId') ?? '').trim();
  const memberId = String(formData.get('memberId') ?? '').trim();
  if (!teamId || !memberId) throw new Error('Team und Mitglied sind erforderlich.');

  await db
    .delete(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.memberId, memberId)));
  revalidateTeamViews(teamId);
  redirect(`/admin/mannschaften/${teamId}`);
}
