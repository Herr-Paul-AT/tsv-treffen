'use server';

import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';
import { uploadPublicFile } from '@/lib/supabase/storage';

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : 'Unbekannter Fehler beim Speichern.';
}

const IMAGE_KINDS = ['none', 'sand', 'lake', 'forest'] as const;
const VISIBILITIES = ['public', 'internal'] as const;

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'beitrag';
}

/** Eindeutigen Slug finden (hängt -2, -3 … an, falls belegt). */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const clash = await db
      .select({ id: news.id })
      .from(news)
      .where(excludeId ? and(eq(news.slug, candidate), ne(news.id, excludeId)) : eq(news.slug, candidate))
      .limit(1);
    if (clash.length === 0) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

function parseNewsForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const excerpt = String(formData.get('excerpt') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!title) throw new Error('Titel ist erforderlich.');
  if (!excerpt) throw new Error('Kurztext (Excerpt) ist erforderlich.');
  if (!body) throw new Error('Beitragstext ist erforderlich.');

  const eyebrowRaw = String(formData.get('eyebrow') ?? '').trim();
  const imageKindRaw = String(formData.get('imageKind') ?? 'none');
  const visibilityRaw = String(formData.get('visibility') ?? 'public');

  return {
    title,
    excerpt,
    body,
    eyebrow: eyebrowRaw || null,
    imageKind: (IMAGE_KINDS as readonly string[]).includes(imageKindRaw)
      ? (imageKindRaw as (typeof IMAGE_KINDS)[number])
      : 'none',
    visibility: (VISIBILITIES as readonly string[]).includes(visibilityRaw)
      ? (visibilityRaw as (typeof VISIBILITIES)[number])
      : 'public',
    pinned: formData.get('pinned') === 'on',
    published: formData.get('published') === 'on',
  };
}

function revalidateNewsViews(slug?: string) {
  revalidatePath('/admin/news');
  revalidatePath('/admin');
  revalidatePath('/app/dashboard');
  revalidatePath('/app/news');
  revalidatePath('/');
  if (slug) revalidatePath(`/app/news/${slug}`);
}

export async function createNews(formData: FormData) {
  let slug = '';
  try {
    const v = parseNewsForm(formData);
    slug = await uniqueSlug(slugify(v.title));
    const me = await getCurrentMember();
    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'news');

    await db.insert(news).values({
      slug,
      title: v.title,
      eyebrow: v.eyebrow,
      excerpt: v.excerpt,
      body: v.body,
      imageKind: v.imageKind,
      visibility: v.visibility,
      attachmentUrl: up?.url ?? null,
      attachmentName: up?.name ?? null,
      pinned: v.pinned,
      authorId: me?.id ?? null,
      publishedAt: v.published ? new Date() : null,
      updatedAt: new Date(),
    });
  } catch (e) {
    redirect(`/admin/news/neu?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateNewsViews(slug);
  redirect('/admin/news');
}

export async function updateNews(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Beitrags-ID fehlt.');
  let slug = '';
  try {
    const v = parseNewsForm(formData);

    const current = await db.select().from(news).where(eq(news.id, id)).limit(1);
    if (!current[0]) throw new Error('Beitrag nicht gefunden.');

    slug = await uniqueSlug(slugify(v.title), id);
    // Veröffentlichungsdatum bewahren, falls schon veröffentlicht; sonst beim Veröffentlichen setzen.
    const publishedAt = v.published ? current[0].publishedAt ?? new Date() : null;

    const file = formData.get('attachment');
    const up = await uploadPublicFile(file instanceof File ? file : null, 'news');
    const currentUrl = String(formData.get('currentAttachmentUrl') ?? '').trim() || null;
    const currentName = String(formData.get('currentAttachmentName') ?? '').trim() || null;

    await db
      .update(news)
      .set({
        slug,
        title: v.title,
        eyebrow: v.eyebrow,
        excerpt: v.excerpt,
        body: v.body,
        imageKind: v.imageKind,
        visibility: v.visibility,
        attachmentUrl: up?.url ?? currentUrl,
        attachmentName: up?.name ?? currentName,
        pinned: v.pinned,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(news.id, id));
  } catch (e) {
    redirect(`/admin/news/${id}?error=${encodeURIComponent(errMsg(e))}`);
  }
  revalidateNewsViews(slug);
  redirect('/admin/news');
}

export async function deleteNews(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Beitrags-ID fehlt.');
  await db.delete(news).where(eq(news.id, id));
  revalidateNewsViews();
  redirect('/admin/news');
}
