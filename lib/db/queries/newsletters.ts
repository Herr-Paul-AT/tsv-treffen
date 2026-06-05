import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, newsletters, teamMembers, type Newsletter } from '@/lib/db/schema';

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

/** Tatsächliche Empfänger (nur Mitglieder mit E-Mail) für eine Zielgruppe. */
export async function resolveRecipients(
  audience: Newsletter['audience'],
  teamId: string | null,
): Promise<NewsletterRecipient[]> {
  const toRecipient = (m: { email: string | null; firstName: string; lastName: string }) => ({
    email: (m.email ?? '').toLowerCase(),
    name: `${m.firstName} ${m.lastName}`,
  });

  if (audience === 'team' && teamId) {
    const rows = await db
      .select({ email: members.email, firstName: members.firstName, lastName: members.lastName })
      .from(teamMembers)
      .innerJoin(members, eq(members.id, teamMembers.memberId))
      .where(and(eq(teamMembers.teamId, teamId), isNotNull(members.email)));
    return rows.map(toRecipient).filter((r) => r.email);
  }

  const conds = [isNotNull(members.email)];
  if (audience === 'active') conds.push(eq(members.status, 'active'));
  if (audience === 'probe') conds.push(eq(members.status, 'probe'));

  const rows = await db
    .select({ email: members.email, firstName: members.firstName, lastName: members.lastName })
    .from(members)
    .where(and(...conds));
  return rows.map(toRecipient).filter((r) => r.email);
}

export async function getRecipientCount(
  audience: Newsletter['audience'],
  teamId: string | null,
): Promise<number> {
  const recipients = await resolveRecipients(audience, teamId);
  return recipients.length;
}
