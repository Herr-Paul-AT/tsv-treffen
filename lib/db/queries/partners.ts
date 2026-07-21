import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { partners, type Partner } from '@/lib/db/schema';

export async function listActivePartners(): Promise<Partner[]> {
  return db.select().from(partners).where(eq(partners.active, true)).orderBy(asc(partners.sortOrder));
}

export async function listAllPartners(): Promise<Partner[]> {
  return db.select().from(partners).orderBy(asc(partners.sortOrder));
}

export async function getPartner(id: string): Promise<Partner | undefined> {
  const rows = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  return rows[0];
}
