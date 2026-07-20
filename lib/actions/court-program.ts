'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { courtProgram } from '@/lib/db/schema';
import { WEEKDAY_VALUES, weekdayOrderFor } from '@/lib/weekdays';

function parseForm(formData: FormData) {
  const weekdayRaw = String(formData.get('weekday') ?? '').trim();
  const weekday = WEEKDAY_VALUES.includes(weekdayRaw) ? weekdayRaw : 'Mo';
  const time = String(formData.get('time') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  if (!time) throw new Error('Zeit ist erforderlich.');
  if (!title) throw new Error('Titel / Gruppe ist erforderlich.');
  return {
    weekday,
    weekdayOrder: weekdayOrderFor(weekday),
    time,
    title,
    trainer: String(formData.get('trainer') ?? '').trim() || null,
    court: String(formData.get('court') ?? '').trim() || null,
    active: formData.get('active') === 'on',
  };
}

function revalidateViews() {
  revalidatePath('/admin/platz-programm');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createCourtProgramEntry(formData: FormData) {
  await db.insert(courtProgram).values(parseForm(formData));
  revalidateViews();
  redirect('/admin/platz-programm');
}

export async function updateCourtProgramEntry(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.update(courtProgram).set(parseForm(formData)).where(eq(courtProgram.id, id));
  revalidateViews();
  redirect('/admin/platz-programm');
}

export async function deleteCourtProgramEntry(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(courtProgram).where(eq(courtProgram.id, id));
  revalidateViews();
  redirect('/admin/platz-programm');
}
