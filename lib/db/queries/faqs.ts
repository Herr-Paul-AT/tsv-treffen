import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { faqs, type Faq } from '@/lib/db/schema';

export async function listActiveFaqs(): Promise<Faq[]> {
  return db.select().from(faqs).where(eq(faqs.active, true)).orderBy(asc(faqs.sortOrder));
}

export async function listAllFaqs(): Promise<Faq[]> {
  return db.select().from(faqs).orderBy(asc(faqs.sortOrder));
}

export async function getFaq(id: string): Promise<Faq | undefined> {
  const rows = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return rows[0];
}
