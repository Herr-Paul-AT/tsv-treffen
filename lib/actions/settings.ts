'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';

async function setSetting(key: string, value: string) {
  const existing = await db
    .select({ k: siteSettings.key })
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  if (existing[0]) {
    await db
      .update(siteSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, value, updatedAt: new Date() });
  }
}

export async function updateSettings(formData: FormData) {
  const yearRaw = String(formData.get('seasonYear') ?? '').trim();
  const seasonYear = /^\d{4}$/.test(yearRaw) ? yearRaw : String(new Date().getFullYear());
  const seasonOpening = String(formData.get('seasonOpening') ?? '').trim();

  await setSetting('season_year', seasonYear);
  await setSetting('season_opening', seasonOpening);

  // Startseite und überall, wo das Saison-Jahr erscheint, neu aufbauen.
  revalidatePath('/');
  revalidatePath('/admin/einstellungen');
  redirect('/admin/einstellungen?saved=1');
}
