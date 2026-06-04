import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, type Member } from '@/lib/db/schema';

const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL ?? 'm.hofmann@tsv-treffen.at';

export async function getCurrentMember(): Promise<Member | null> {
  const rows = await db.select().from(members).where(eq(members.email, DEV_USER_EMAIL)).limit(1);
  return rows[0] ?? null;
}

export async function requireCurrentMember(): Promise<Member> {
  const m = await getCurrentMember();
  if (!m) throw new Error('No current member — seed the database or sign in.');
  return m;
}
