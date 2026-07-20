import { and, asc, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, newsletters, teamMembers, type Newsletter } from '@/lib/db/schema';

export type MailMemberOption = { id: string; name: string; email: string; category: string | null };

/** Mitglieder mit E-Mail als Auswahl-Optionen für die Einzelauswahl. */
export async function listMailMemberOptions(): Promise<MailMemberOption[]> {
  const rows = await db
    .select({
      id: members.id,
      firstName: members.firstName,
      lastName: members.lastName,
      email: members.email,
      category: members.category,
    })
    .from(members)
    .where(isNotNull(members.email))
    .orderBy(asc(members.lastName), asc(members.firstName));
  return rows
    .filter((r) => r.email)
    .map((r) => ({
      id: r.id,
      name: `${r.firstName} ${r.lastName}`,
      email: (r.email ?? '').toLowerCase(),
      category: r.category,
    }));
}

export type NewsletterWithAuthor = Newsletter & { authorName: string | null };

export async function listNewsletters(): Promise<NewsletterWithAuthor[]> {
  const rows = await db
    .select({
      newsletter: newsletters,
      authorFirst: members.firstName,
      authorLast: members.lastName,
    })
    .from(newsletters)
    .leftJoin(members, eq(members.id, newsletters.authorId))
    .orderBy(desc(newsletters.sentAt), desc(newsletters.updatedAt));
  return rows.map((r) => ({
    ...r.newsletter,
    authorName: r.authorFirst && r.authorLast ? `${r.authorFirst} ${r.authorLast}` : null,
  }));
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  const rows = await db.select().from(newsletters).where(eq(newsletters.id, id)).limit(1);
  return rows[0] ?? null;
}

export type NewsletterRecipient = { email: string; name: string };

export type AudienceSpec = {
  audience: Newsletter['audience'];
  teamId: string | null;
  category: Newsletter['audienceCategory'];
  memberIds: string[];
};

/** Baut die Zielgruppen-Spezifikation aus einem gespeicherten Newsletter. */
export function audienceSpecFromNewsletter(nl: Newsletter): AudienceSpec {
  return {
    audience: nl.audience,
    teamId: nl.audienceTeamId,
    category: nl.audienceCategory,
    memberIds: (nl.audienceMemberIds ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  };
}

/** Tatsächliche Empfänger (nur Mitglieder mit E-Mail) für eine Zielgruppe. */
export async function resolveRecipients(spec: AudienceSpec): Promise<NewsletterRecipient[]> {
  const toRecipient = (m: { email: string | null; firstName: string; lastName: string }) => ({
    email: (m.email ?? '').toLowerCase(),
    name: `${m.firstName} ${m.lastName}`,
  });

  if (spec.audience === 'team') {
    if (!spec.teamId) return [];
    const rows = await db
      .select({ email: members.email, firstName: members.firstName, lastName: members.lastName })
      .from(teamMembers)
      .innerJoin(members, eq(members.id, teamMembers.memberId))
      .where(and(eq(teamMembers.teamId, spec.teamId), isNotNull(members.email)));
    return rows.map(toRecipient).filter((r) => r.email);
  }

  if (spec.audience === 'custom') {
    if (spec.memberIds.length === 0) return [];
    const rows = await db
      .select({ email: members.email, firstName: members.firstName, lastName: members.lastName })
      .from(members)
      .where(and(isNotNull(members.email), inArray(members.id, spec.memberIds)));
    return rows.map(toRecipient).filter((r) => r.email);
  }

  const conds = [isNotNull(members.email)];
  if (spec.audience === 'active') conds.push(eq(members.status, 'active'));
  if (spec.audience === 'probe') conds.push(eq(members.status, 'probe'));
  if (spec.audience === 'sponsors') conds.push(eq(members.isSponsor, true));
  if (spec.audience === 'category') {
    if (!spec.category) return [];
    conds.push(eq(members.category, spec.category));
  }

  const rows = await db
    .select({ email: members.email, firstName: members.firstName, lastName: members.lastName })
    .from(members)
    .where(and(...conds));
  return rows.map(toRecipient).filter((r) => r.email);
}

export async function getRecipientCount(spec: AudienceSpec): Promise<number> {
  const recipients = await resolveRecipients(spec);
  return recipients.length;
}
