import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, newsletters, type Newsletter } from '@/lib/db/schema';

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

export async function getRecipientCount(audience: Newsletter['audience'], teamId: string | null): Promise<number> {
  // For demo: approximate, doesn't need to be exact.
  const all = await db.select().from(members);
  if (audience === 'all') return all.length;
  if (audience === 'active') return all.filter((m) => m.status === 'active').length;
  if (audience === 'probe') return all.filter((m) => m.status === 'probe').length;
  if (audience === 'team' && teamId) {
    const { teamMembers } = await import('@/lib/db/schema');
    const rows = await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
    return rows.length;
  }
  return 0;
}
