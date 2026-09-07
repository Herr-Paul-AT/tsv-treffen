'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { galleryImages } from '@/lib/db/schema';
import { uploadPublicImage } from '@/lib/supabase/storage';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

function revalidateGalleryViews() {
  revalidatePath('/admin/galerie');
  revalidatePath('/galerie');
  revalidatePath('/');
}

/** Ein oder mehrere Bilder in die Galerie hochladen. */
export async function addGalleryImages(formData: FormData) {
  try {
    const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) throw new Error('Bitte mindestens ein Bild auswählen.');

    const caption = String(formData.get('caption') ?? '').trim() || null;
    const sortRaw = String(formData.get('sortOrder') ?? '').trim();
    const sortOrder = sortRaw && /^\d+$/.test(sortRaw) ? Number(sortRaw) : 0;

    const rows: (typeof galleryImages.$inferInsert)[] = [];
    for (const file of files) {
      const url = await uploadPublicImage(file, 'galerie');
      if (url) rows.push({ url, caption, sortOrder });
    }
    if (rows.length > 0) await db.insert(galleryImages).values(rows);
  } catch (e) {
    redirect(`/admin/galerie?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateGalleryViews();
  redirect('/admin/galerie?added=1');
}

export async function deleteGalleryImage(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Bild-ID fehlt.');
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  revalidateGalleryViews();
  redirect('/admin/galerie');
}
