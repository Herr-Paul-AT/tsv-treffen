'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { surveyOptions, surveyVotes, surveys } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

/** Neue Umfrage anlegen: Frage + Optionen (eine pro Zeile). */
export async function createSurvey(formData: FormData) {
  try {
    const question = String(formData.get('question') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim() || null;
    const optionLines = String(formData.get('options') ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (!question) throw new Error('Bitte eine Frage angeben.');
    if (optionLines.length < 2) throw new Error('Bitte mindestens zwei Antwortoptionen angeben.');

    const inserted = await db.insert(surveys).values({ question, description }).returning();
    const surveyId = inserted[0]?.id;
    if (!surveyId) throw new Error('Umfrage konnte nicht angelegt werden.');

    await db.insert(surveyOptions).values(
      optionLines.map((label, i) => ({ surveyId, label, sortOrder: i })),
    );
  } catch (e) {
    redirect(`/admin/umfragen?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidatePath('/admin/umfragen');
  revalidatePath('/app/umfragen');
  redirect('/admin/umfragen?created=1');
}

export async function toggleSurvey(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  const active = formData.get('active') === '1';
  if (!id) throw new Error('Umfrage-ID fehlt.');
  await db.update(surveys).set({ active }).where(eq(surveys.id, id));
  revalidatePath('/admin/umfragen');
  revalidatePath('/app/umfragen');
  redirect('/admin/umfragen');
}

export async function deleteSurvey(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Umfrage-ID fehlt.');
  await db.delete(surveys).where(eq(surveys.id, id));
  revalidatePath('/admin/umfragen');
  revalidatePath('/app/umfragen');
  redirect('/admin/umfragen');
}

/** Stimme eines Mitglieds abgeben/ändern (eine Stimme pro Umfrage). */
export async function submitVote(formData: FormData) {
  const surveyId = String(formData.get('surveyId') ?? '').trim();
  const optionId = String(formData.get('optionId') ?? '').trim();
  if (!surveyId || !optionId) redirect('/app/umfragen');

  const me = await getCurrentMember();
  if (!me) redirect('/login');

  // Option muss zur Umfrage gehören.
  const opt = await db
    .select({ id: surveyOptions.id })
    .from(surveyOptions)
    .where(and(eq(surveyOptions.id, optionId), eq(surveyOptions.surveyId, surveyId)))
    .limit(1);
  if (!opt[0]) redirect('/app/umfragen');

  const existing = await db
    .select({ surveyId: surveyVotes.surveyId })
    .from(surveyVotes)
    .where(and(eq(surveyVotes.surveyId, surveyId), eq(surveyVotes.memberId, me.id)))
    .limit(1);

  if (existing[0]) {
    await db
      .update(surveyVotes)
      .set({ optionId, createdAt: new Date() })
      .where(and(eq(surveyVotes.surveyId, surveyId), eq(surveyVotes.memberId, me.id)));
  } else {
    await db.insert(surveyVotes).values({ surveyId, memberId: me.id, optionId });
  }

  revalidatePath('/app/umfragen');
  redirect('/app/umfragen?voted=1');
}
