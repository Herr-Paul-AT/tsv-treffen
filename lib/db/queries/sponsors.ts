import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sponsors, type Sponsor } from '@/lib/db/schema';

export async function listActiveSponsors(): Promise<Sponsor[]> {
  return db.select().from(sponsors).where(eq(sponsors.active, true)).orderBy(asc(sponsors.sortOrder));
}
