import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { membershipPlans, type MembershipPlan } from '@/lib/db/schema';

/** Aktive Pakete für die öffentliche Startseite, nach sortOrder. */
export async function listActiveMembershipPlans(): Promise<MembershipPlan[]> {
  return db
    .select()
    .from(membershipPlans)
    .where(eq(membershipPlans.active, true))
    .orderBy(asc(membershipPlans.sortOrder), asc(membershipPlans.priceCents));
}

/** Alle Pakete (inkl. inaktive) für den Adminbereich. */
export async function listAllMembershipPlans(): Promise<MembershipPlan[]> {
  return db
    .select()
    .from(membershipPlans)
    .orderBy(asc(membershipPlans.sortOrder), asc(membershipPlans.priceCents));
}

export async function getMembershipPlan(id: string): Promise<MembershipPlan | undefined> {
  const rows = await db.select().from(membershipPlans).where(eq(membershipPlans.id, id)).limit(1);
  return rows[0];
}
