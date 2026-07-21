'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { partners } from '@/lib/db/schema';
import { uploadPublicImage } from '@/lib/supabase/storage';

function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function parseBase(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Name ist erforderlich.');
  const sortRaw = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  return {
    name,
    url: normalizeUrl(String(formData.get('url') ?? '')),
    sortOrder: Number.isNaN(sortRaw) ? 0 : sortRaw,
    active: formData.get('active') === 'on',
  };
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

function revalidatePartnerViews() {
  revalidatePath('/admin/partner');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createPartner(formData: FormData) {
  try {
    const base = parseBase(formData);
    const logo = formData.get('logo');
    const logoUrl = await uploadPublicImage(logo instanceof File ? logo : null, 'partners');
    await db.insert(partners).values({ ...base, logoUrl });
  } catch (e) {
    redirect(`/admin/partner/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidatePartnerViews();
  redirect('/admin/partner');
}

export async function updatePartner(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  try {
    const base = parseBase(formData);
    const logo = formData.get('logo');
    const uploaded = await uploadPublicImage(logo instanceof File ? logo : null, 'partners');
    const currentLogoUrl = String(formData.get('currentLogoUrl') ?? '').trim() || null;
    await db
      .update(partners)
      .set({ ...base, logoUrl: uploaded ?? currentLogoUrl })
      .where(eq(partners.id, id));
  } catch (e) {
    redirect(`/admin/partner/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidatePartnerViews();
  redirect('/admin/partner');
}

export async function deletePartner(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(partners).where(eq(partners.id, id));
  revalidatePartnerViews();
  redirect('/admin/partner');
}
