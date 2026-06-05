import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, type Member } from '@/lib/db/schema';
import { getAuthEmail } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const DEV_USER_EMAIL = process.env.DEV_USER_EMAIL ?? 'm.hofmann@tsv-treffen.at';

/**
 * Aktuelles Mitglied.
 * - Mit Supabase: Mitglied wird über die E-Mail der angemeldeten Session gefunden.
 * - Ohne Supabase (Dev): fester DEV_USER_EMAIL-Fallback.
 */
export async function getCurrentMember(): Promise<Member | null> {
  let email: string | null;
  if (isSupabaseConfigured()) {
    email = await getAuthEmail();
    if (!email) return null;
  } else {
    email = DEV_USER_EMAIL;
  }

  const rows = await db
    .select()
    .from(members)
    .where(eq(members.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function requireCurrentMember(): Promise<Member> {
  const m = await getCurrentMember();
  if (!m) throw new Error('No current member — seed the database or sign in.');
  return m;
}
