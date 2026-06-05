'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';

const CATEGORIES = ['statuten', 'beitraege', 'protokoll', 'spielregeln', 'formular', 'sonstiges'] as const;
type Category = (typeof CATEGORIES)[number];

function fileTypeFromUrl(url: string): string {
  const clean = url.toLowerCase().split('?')[0];
  if (clean.endsWith('.pdf')) return 'application/pdf';
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(clean)) return 'image';
  if (/\.(docx?|odt)$/.test(clean)) return 'application/msword';
  if (/\.(xlsx?|ods|csv)$/.test(clean)) return 'application/vnd.ms-excel';
  return 'link';
}

function parseDocumentForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const fileUrl = String(formData.get('fileUrl') ?? '').trim();
  if (!title) throw new Error('Titel ist erforderlich.');
  if (!fileUrl) throw new Error('Ein Link / eine Datei-URL ist erforderlich.');
  // Absolute Links (http/https) oder interne/Storage-Pfade (mit / beginnend) erlauben.
  if (!/^https?:\/\//i.test(fileUrl) && !fileUrl.startsWith('/')) {
    throw new Error('Der Link muss mit http://, https:// oder / beginnen.');
  }

  const categoryRaw = String(formData.get('category') ?? 'sonstiges');
  const category: Category = (CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as Category)
    : 'sonstiges';

  return {
    title,
    fileUrl,
    fileType: fileTypeFromUrl(fileUrl),
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
  const values = parseDocumentForm(formData);
  const me = await getCurrentMember();
  await db.insert(documents).values({ ...values, uploadedBy: me?.id ?? null, uploadedAt: new Date() });
  revalidateDocumentViews();
  redirect('/admin/dokumente');
}

export async function updateDocument(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Dokument-ID fehlt.');
  const values = parseDocumentForm(formData);
  await db.update(documents).set(values).where(eq(documents.id, id));
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
