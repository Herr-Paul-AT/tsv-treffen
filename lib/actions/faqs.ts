'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { faqs } from '@/lib/db/schema';

function parseForm(formData: FormData) {
  const question = String(formData.get('question') ?? '').trim();
  const answer = String(formData.get('answer') ?? '').trim();
  if (!question) throw new Error('Frage ist erforderlich.');
  if (!answer) throw new Error('Antwort ist erforderlich.');
  const sortRaw = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  return {
    question,
    answer,
    sortOrder: Number.isNaN(sortRaw) ? 0 : sortRaw,
    active: formData.get('active') === 'on',
  };
}

function revalidateViews() {
  revalidatePath('/admin/faq');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createFaq(formData: FormData) {
  await db.insert(faqs).values(parseForm(formData));
  revalidateViews();
  redirect('/admin/faq');
}

export async function updateFaq(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.update(faqs).set(parseForm(formData)).where(eq(faqs.id, id));
  revalidateViews();
  redirect('/admin/faq');
}

export async function deleteFaq(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidateViews();
  redirect('/admin/faq');
}
