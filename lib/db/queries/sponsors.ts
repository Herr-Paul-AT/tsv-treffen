import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sponsors, type Sponsor } from '@/lib/db/schema';

export async function listActiveSponsors(): Promise<Sponsor[]> {
  return db.select().from(sponsors).where(eq(sponsors.active, true)).orderBy(asc(sponsors.sortOrder));
}

export async function listAllSponsors(): Promise<Sponsor[]> {
  return db.select().from(sponsors).orderBy(asc(sponsors.sortOrder));
}

export async function getSponsor(id: string): Promise<Sponsor | undefined> {
  const rows = await db.select().from(sponsors).where(eq(sponsors.id, id)).limit(1);
  return rows[0];
}
