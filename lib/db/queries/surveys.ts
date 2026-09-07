import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { surveyOptions, surveyVotes, surveys, type Survey } from '@/lib/db/schema';

export type SurveyOptionResult = {
  id: string;
  label: string;
  votes: number;
};

export type SurveyWithResults = Survey & {
  options: SurveyOptionResult[];
  totalVotes: number;
  myOptionId: string | null;
};

/** Zählt die Stimmen je Option für die angegebenen Umfragen. */
async function voteCounts(surveyIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (surveyIds.length === 0) return map;
  const rows = await db
    .select({ optionId: surveyVotes.optionId, c: sql<number>`count(*)::int` })
    .from(surveyVotes)
    .where(inArray(surveyVotes.surveyId, surveyIds))
    .groupBy(surveyVotes.optionId);
  for (const r of rows) map.set(r.optionId, r.c);
  return map;
}

async function buildResults(list: Survey[], memberId: string | null): Promise<SurveyWithResults[]> {
  if (list.length === 0) return [];
  const ids = list.map((s) => s.id);
  const opts = await db
    .select()
    .from(surveyOptions)
    .where(inArray(surveyOptions.surveyId, ids))
    .orderBy(asc(surveyOptions.sortOrder));
  const counts = await voteCounts(ids);

  const myVotes = new Map<string, string>();
  if (memberId) {
    const mine = await db
      .select({ surveyId: surveyVotes.surveyId, optionId: surveyVotes.optionId })
      .from(surveyVotes)
      .where(and(inArray(surveyVotes.surveyId, ids), eq(surveyVotes.memberId, memberId)));
    for (const v of mine) myVotes.set(v.surveyId, v.optionId);
  }

  return list.map((s) => {
    const options = opts
      .filter((o) => o.surveyId === s.id)
      .map((o) => ({ id: o.id, label: o.label, votes: counts.get(o.id) ?? 0 }));
    const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
    return { ...s, options, totalVotes, myOptionId: myVotes.get(s.id) ?? null };
  });
}

/** Aktive Umfragen inkl. Ergebnissen + eigener Stimme (Mitgliederbereich). */
export async function listActiveSurveys(memberId: string | null): Promise<SurveyWithResults[]> {
  const list = await db
    .select()
    .from(surveys)
    .where(eq(surveys.active, true))
    .orderBy(desc(surveys.createdAt));
  return buildResults(list, memberId);
}

/** Alle Umfragen inkl. Ergebnissen (Admin). */
export async function listAllSurveys(): Promise<SurveyWithResults[]> {
  const list = await db.select().from(surveys).orderBy(desc(surveys.createdAt));
  return buildResults(list, null);
}
