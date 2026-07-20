import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { courtProgram, type CourtProgramEntry } from '@/lib/db/schema';

export async function listActiveCourtProgram(): Promise<CourtProgramEntry[]> {
  return db
    .select()
    .from(courtProgram)
    .where(eq(courtProgram.active, true))
    .orderBy(asc(courtProgram.weekdayOrder), asc(courtProgram.time));
}

export async function listAllCourtProgram(): Promise<CourtProgramEntry[]> {
  return db
    .select()
    .from(courtProgram)
    .orderBy(asc(courtProgram.weekdayOrder), asc(courtProgram.time));
}

export async function getCourtProgramEntry(id: string): Promise<CourtProgramEntry | undefined> {
  const rows = await db.select().from(courtProgram).where(eq(courtProgram.id, id)).limit(1);
  return rows[0];
}
