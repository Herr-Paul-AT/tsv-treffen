import { sql, eq, asc, inArray, and, or, ilike } from 'drizzle-orm';
import { db } from '@/lib/db';
import { rawRows } from '@/lib/db/raw';
import { members, teamMembers, teams, type Member } from '@/lib/db/schema';

export type MemberRow = Member & { teamName: string | null };

export async function listMembers(limit = 50): Promise<MemberRow[]> {
  const rows = await db
    .select({
      member: members,
      teamName: teams.name,
    })
    .from(members)
    .leftJoin(teamMembers, eq(teamMembers.memberId, members.id))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .orderBy(asc(members.lastName), asc(members.firstName))
    .limit(limit);

  const seen = new Map<string, MemberRow>();
  for (const r of rows) {
    if (!seen.has(r.member.id)) {
      seen.set(r.member.id, { ...r.member, teamName: r.teamName });
    }
  }
  return Array.from(seen.values());
}

/** Mitglieder, die als Trainer in Frage kommen (Funktionsrollen) — für Auswahlfelder. */
export async function listTrainerOptions(): Promise<{ id: string; name: string }[]> {
  const rows = await db
    .select({ id: members.id, firstName: members.firstName, lastName: members.lastName })
    .from(members)
    .where(inArray(members.role, ['trainer', 'jugendleiter', 'obmann', 'admin']))
    .orderBy(asc(members.lastName), asc(members.firstName));
  return rows.map((r) => ({ id: r.id, name: `${r.firstName} ${r.lastName}` }));
}

export type MemberFilter = {
  search?: string;
  status?: Member['status'];
  dues?: Member['paymentStatus'];
  page?: number;
  pageSize?: number;
};

export type FilteredMembers = {
  rows: MemberRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Mitgliederliste mit Suche, Status-/Beitragsfilter und Paginierung. */
export async function listMembersFiltered(f: MemberFilter): Promise<FilteredMembers> {
  const pageSize = f.pageSize ?? 25;
  const page = Math.max(1, f.page ?? 1);

  const conds = [];
  if (f.search) {
    const q = `%${f.search}%`;
    conds.push(or(ilike(members.firstName, q), ilike(members.lastName, q), ilike(members.email, q)));
  }
  if (f.status) conds.push(eq(members.status, f.status));
  if (f.dues) conds.push(eq(members.paymentStatus, f.dues));
  const where = conds.length ? and(...conds) : undefined;

  const countRows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(members)
    .where(where);
  const total = countRows[0]?.c ?? 0;

  const rows = await db
    .select()
    .from(members)
    .where(where)
    .orderBy(asc(members.lastName), asc(members.firstName))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  // Erste Team-Zugehörigkeit je Mitglied nachladen.
  const ids = rows.map((r) => r.id);
  const teamMap = new Map<string, string>();
  if (ids.length) {
    const tr = await db
      .select({ memberId: teamMembers.memberId, name: teams.name })
      .from(teamMembers)
      .innerJoin(teams, eq(teams.id, teamMembers.teamId))
      .where(inArray(teamMembers.memberId, ids));
    for (const r of tr) if (!teamMap.has(r.memberId)) teamMap.set(r.memberId, r.name);
  }

  return {
    rows: rows.map((m) => ({ ...m, teamName: teamMap.get(m.id) ?? null })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getMember(id: string): Promise<Member | null> {
  const rows = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Alle vorhandenen E-Mail-Adressen (kleingeschrieben) — für Dublettenprüfung beim Import. */
export async function getExistingEmails(): Promise<Set<string>> {
  const rows = await db.select({ email: members.email }).from(members);
  return new Set(
    rows
      .map((r) => r.email?.toLowerCase())
      .filter((e): e is string => Boolean(e)),
  );
}

export type MemberStats = {
  total: number;
  active: number;
  joinedThisYear: number;
  paymentsOpen: number;
  paymentsOpenCents: number;
  probe: number;
  probeInProgress: number;
};

export async function getMemberStats(): Promise<MemberStats> {
  const currentYear = new Date().getFullYear();
  const rows = await rawRows<{
    total: number;
    active: number;
    joined_this_year: number;
    payments_open: number;
    payments_open_cents: number;
    probe: number;
  }>(sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'active')::int AS active,
      COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM member_since)::int = ${currentYear})::int AS joined_this_year,
      COUNT(*) FILTER (WHERE payment_status IN ('open','partial'))::int AS payments_open,
      COALESCE(SUM(payment_due_cents) FILTER (WHERE payment_status IN ('open','partial')), 0)::int AS payments_open_cents,
      COUNT(*) FILTER (WHERE status = 'probe')::int AS probe
    FROM members
  `);
  const r = rows[0];
  return {
    total: r.total,
    active: r.active,
    joinedThisYear: r.joined_this_year,
    paymentsOpen: r.payments_open,
    paymentsOpenCents: r.payments_open_cents,
    probe: r.probe,
    probeInProgress: Math.ceil(r.probe / 2),
  };
}
