'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { trainings } from '@/lib/db/schema';

function parseTrainingForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Titel ist erforderlich.');

  const startsAtRaw = String(formData.get('startsAt') ?? '').trim();
  const endsAtRaw = String(formData.get('endsAt') ?? '').trim();
  if (!startsAtRaw) throw new Error('Beginn ist erforderlich.');
  if (!endsAtRaw) throw new Error('Ende ist erforderlich.');

  const startsAt = new Date(startsAtRaw);
  const endsAt = new Date(endsAtRaw);
  if (Number.isNaN(startsAt.getTime())) throw new Error('Ungültiger Beginn.');
  if (Number.isNaN(endsAt.getTime())) throw new Error('Ungültiges Ende.');
  if (endsAt <= startsAt) throw new Error('Das Ende muss nach dem Beginn liegen.');

  const teamId = String(formData.get('teamId') ?? '').trim() || null;
  const trainerId = String(formData.get('trainerId') ?? '').trim() || null;
  const court = String(formData.get('court') ?? '').trim() || null;

  const maxRaw = String(formData.get('maxAttendees') ?? '').trim();
  const maxAttendees = maxRaw && /^\d+$/.test(maxRaw) ? Number(maxRaw) : null;

  const cancelled = formData.get('cancelled') === 'on';
  const cancelReason = cancelled
    ? String(formData.get('cancelReason') ?? '').trim() || null
    : null;

  return { title, startsAt, endsAt, teamId, trainerId, court, maxAttendees, cancelled, cancelReason };
}

function revalidateTrainingViews(id?: string) {
  revalidatePath('/admin/trainings');
  revalidatePath('/admin');
  revalidatePath('/app/dashboard');
  revalidatePath('/app/kalender');
  if (id) revalidatePath(`/app/trainings/${id}`);
}

export async function createTraining(formData: FormData) {
  const values = parseTrainingForm(formData);
  await db.insert(trainings).values(values);
  revalidateTrainingViews();
  redirect('/admin/trainings');
}

export async function updateTraining(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Trainings-ID fehlt.');
  const values = parseTrainingForm(formData);
  await db.update(trainings).set(values).where(eq(trainings.id, id));
  revalidateTrainingViews(id);
  redirect('/admin/trainings');
}

export async function deleteTraining(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Trainings-ID fehlt.');
  await db.delete(trainings).where(eq(trainings.id, id));
  revalidateTrainingViews(id);
  redirect('/admin/trainings');
}
