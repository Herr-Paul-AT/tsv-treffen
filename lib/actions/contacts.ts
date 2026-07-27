'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { contacts } from '@/lib/db/schema';
import { uploadPublicImage } from '@/lib/supabase/storage';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

function parseBase(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Name ist erforderlich.');
  const sortRaw = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  return {
    name,
    role: String(formData.get('role') ?? '').trim() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
    email: String(formData.get('email') ?? '').trim().toLowerCase() || null,
    sortOrder: Number.isNaN(sortRaw) ? 0 : sortRaw,
    active: formData.get('active') === 'on',
  };
}

function revalidateContactViews() {
  revalidatePath('/admin/kontakte');
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/app/kontakte');
}

export async function createContact(formData: FormData) {
  try {
    const base = parseBase(formData);
    const photo = formData.get('photo');
    const photoUrl = await uploadPublicImage(photo instanceof File ? photo : null, 'contacts');
    await db.insert(contacts).values({ ...base, photoUrl });
  } catch (e) {
    redirect(`/admin/kontakte/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateContactViews();
  redirect('/admin/kontakte');
}

export async function updateContact(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  try {
    const base = parseBase(formData);
    const photo = formData.get('photo');
    const uploaded = await uploadPublicImage(photo instanceof File ? photo : null, 'contacts');
    const currentPhotoUrl = String(formData.get('currentPhotoUrl') ?? '').trim() || null;
    await db
      .update(contacts)
      .set({ ...base, photoUrl: uploaded ?? currentPhotoUrl })
      .where(eq(contacts.id, id));
  } catch (e) {
    redirect(`/admin/kontakte/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateContactViews();
  redirect('/admin/kontakte');
}

export async function deleteContact(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidateContactViews();
  redirect('/admin/kontakte');
}
