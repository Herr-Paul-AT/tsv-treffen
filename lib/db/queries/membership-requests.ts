import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { membershipRequests, type MembershipRequest } from '@/lib/db/schema';

export async function listMembershipRequests(): Promise<MembershipRequest[]> {
  return db.select().from(membershipRequests).orderBy(desc(membershipRequests.createdAt));
}

export async function getMembershipRequest(id: string): Promise<MembershipRequest | undefined> {
  const rows = await db
    .select()
    .from(membershipRequests)
    .where(eq(membershipRequests.id, id))
    .limit(1);
  return rows[0];
}

export async function countNewMembershipRequests(): Promise<number> {
  const rows = await db
    .select({ id: membershipRequests.id })
    .from(membershipRequests)
    .where(eq(membershipRequests.status, 'new'));
  return rows.length;
}
