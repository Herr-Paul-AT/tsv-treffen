'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';
import { uploadPublicFile } from '@/lib/supabase/storage';

const CATEGORIES = ['statuten', 'beitraege', 'protokoll', 'spielregeln', 'formular', 'sonstiges'] as const;
type Category = (typeof CATEGORIES)[number];

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

function fileTypeFromUrl(url: string): string {
  const clean = url.toLowerCase().split('?')[0];
  if (clean.endsWith('.pdf')) return 'application/pdf';
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(clean)) return 'image';
  if (/\.(docx?|odt)$/.test(clean)) return 'application/msword';
  if (/\.(xlsx?|ods|csv)$/.test(clean)) return 'application/vnd.ms-excel';
  return 'link';
}

/**
 * Datei-Quelle bestimmen: hochgeladene Datei hat Vorrang, sonst Link-Feld,
 * beim Bearbeiten sonst die bisherige Datei.
 */
async function resolveFile(formData: FormData): Promise<{ fileUrl: string; fileSize: number | null }> {
  const file = formData.get('file');
  const uploaded = await uploadPublicFile(file instanceof File ? file : null, 'dokumente');
  if (uploaded) return { fileUrl: uploaded.url, fileSize: file instanceof File ? file.size : null };

  const fileUrl = String(formData.get('fileUrl') ?? '').trim();
  if (fileUrl) {
    // Absolute Links (http/https) oder interne/Storage-Pfade (mit / beginnend) erlauben.
    if (!/^https?:\/\//i.test(fileUrl) && !fileUrl.startsWith('/')) {
      throw new Error('Der Link muss mit http://, https:// oder / beginnen.');
    }
    return { fileUrl, fileSize: null };
  }

  const current = String(formData.get('currentFileUrl') ?? '').trim();
  if (current) return { fileUrl: current, fileSize: null };
  throw new Error('Bitte eine Datei hochladen oder einen Link angeben.');
}

async function parseDocumentForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) throw new Error('Titel ist erforderlich.');
  const { fileUrl, fileSize } = await resolveFile(formData);

  const categoryRaw = String(formData.get('category') ?? 'sonstiges');
  const category: Category = (CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as Category)
    : 'sonstiges';

  return {
    title,
    fileUrl,
    fileType: fileTypeFromUrl(fileUrl),
    ...(fileSize != null ? { fileSize } : {}),
    category,
    description: String(formData.get('description') ?? '').trim() || null,
    validFrom: String(formData.get('validFrom') ?? '').trim() || null,
    pinned: formData.get('pinned') === 'on',
  };
}

function revalidateDocumentViews() {
  revalidatePath('/admin/dokumente');
  revalidatePath('/app/dokumente');
  revalidatePath('/app/profil');
}

export async function createDocument(formData: FormData) {
  try {
    const values = await parseDocumentForm(formData);
    const me = await getCurrentMember();
    await db.insert(documents).values({ ...values, uploadedBy: me?.id ?? null, uploadedAt: new Date() });
  } catch (e) {
    redirect(`/admin/dokumente/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateDocumentViews();
  redirect('/admin/dokumente');
}

export async function updateDocument(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Dokument-ID fehlt.');
  try {
    const values = await parseDocumentForm(formData);
    await db.update(documents).set(values).where(eq(documents.id, id));
  } catch (e) {
    redirect(`/admin/dokumente/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateDocumentViews();
  redirect('/admin/dokumente');
}

export async function deleteDocument(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Dokument-ID fehlt.');
  await db.delete(documents).where(eq(documents.id, id));
  revalidateDocumentViews();
  redirect('/admin/dokumente');
}
