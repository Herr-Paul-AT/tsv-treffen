'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { sponsors } from '@/lib/db/schema';
import { uploadPublicImage } from '@/lib/supabase/storage';

function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

type SponsorBase = {
  name: string;
  website: string | null;
  sortOrder: number;
  active: boolean;
};

function parseBase(formData: FormData): SponsorBase {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Name ist erforderlich.');
  const sortRaw = Number.parseInt(String(formData.get('sortOrder') ?? '0'), 10);
  return {
    name,
    website: normalizeUrl(String(formData.get('website') ?? '')),
    sortOrder: Number.isNaN(sortRaw) ? 0 : sortRaw,
    active: formData.get('active') === 'on',
  };
}

function revalidateSponsorViews() {
  revalidatePath('/admin/sponsoren');
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function createSponsor(formData: FormData) {
  const base = parseBase(formData);
  const logo = formData.get('logo');
  const logoUrl = await uploadPublicImage(logo instanceof File ? logo : null, 'sponsors');
  await db.insert(sponsors).values({ ...base, logoUrl });
  revalidateSponsorViews();
  redirect('/admin/sponsoren');
}

export async function updateSponsor(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  const base = parseBase(formData);
  const logo = formData.get('logo');
  const uploaded = await uploadPublicImage(logo instanceof File ? logo : null, 'sponsors');
  // Neues Logo hochgeladen? sonst bestehendes behalten.
  const currentLogoUrl = String(formData.get('currentLogoUrl') ?? '').trim() || null;
  await db
    .update(sponsors)
    .set({ ...base, logoUrl: uploaded ?? currentLogoUrl })
    .where(eq(sponsors.id, id));
  revalidateSponsorViews();
  redirect('/admin/sponsoren');
}

export async function deleteSponsor(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Datensatz-ID fehlt.');
  await db.delete(sponsors).where(eq(sponsors.id, id));
  revalidateSponsorViews();
  redirect('/admin/sponsoren');
}
