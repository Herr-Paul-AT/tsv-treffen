'use server';

import { and, eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';
import { getCurrentMember } from '@/lib/db/queries/session';

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
  const v = parseNewsForm(formData);
  const slug = await uniqueSlug(slugify(v.title));
  const me = await getCurrentMember();

  await db.insert(news).values({
    slug,
    title: v.title,
    eyebrow: v.eyebrow,
    excerpt: v.excerpt,
    body: v.body,
    imageKind: v.imageKind,
    visibility: v.visibility,
    pinned: v.pinned,
    authorId: me?.id ?? null,
    publishedAt: v.published ? new Date() : null,
    updatedAt: new Date(),
  });
  revalidateNewsViews(slug);
  redirect('/admin/news');
}

export async function updateNews(formData: FormData) {
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Beitrags-ID fehlt.');
  const v = parseNewsForm(formData);

  const current = await db.select().from(news).where(eq(news.id, id)).limit(1);
  if (!current[0]) throw new Error('Beitrag nicht gefunden.');

  const slug = await uniqueSlug(slugify(v.title), id);
  // Veröffentlichungsdatum bewahren, falls schon veröffentlicht; sonst beim Veröffentlichen setzen.
  const publishedAt = v.published ? current[0].publishedAt ?? new Date() : null;

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
      pinned: v.pinned,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(news.id, id));
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
