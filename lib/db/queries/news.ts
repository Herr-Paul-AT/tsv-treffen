import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members, news, newsReads, type News } from '@/lib/db/schema';

export type NewsWithAuthor = News & {
  authorName: string | null;
  authorInitials: string | null;
  authorTone: string | null;
};

export async function listNews(
  limit = 20,
  opts: { publicOnly?: boolean } = {},
): Promise<NewsWithAuthor[]> {
  const where = opts.publicOnly
    ? and(isNotNull(news.publishedAt), eq(news.visibility, 'public'))
    : isNotNull(news.publishedAt);

  const rows = await db
    .select({
      news,
      authorFirst: members.firstName,
      authorLast: members.lastName,
      authorInitials: members.initials,
      authorTone: members.avatarTone,
    })
    .from(news)
    .leftJoin(members, eq(members.id, news.authorId))
    .where(where)
    .orderBy(desc(news.pinned), desc(news.publishedAt))
    .limit(limit);

  return rows.map((r) => ({
    ...r.news,
    authorName: r.authorFirst && r.authorLast ? `${r.authorFirst} ${r.authorLast}` : null,
    authorInitials: r.authorInitials,
    authorTone: r.authorTone,
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsWithAuthor | null> {
  const rows = await db
    .select({
      news,
      authorFirst: members.firstName,
      authorLast: members.lastName,
      authorInitials: members.initials,
      authorTone: members.avatarTone,
    })
    .from(news)
    .leftJoin(members, eq(members.id, news.authorId))
    .where(eq(news.slug, slug))
    .limit(1);
  if (!rows[0]) return null;
  return {
    ...rows[0].news,
    authorName:
      rows[0].authorFirst && rows[0].authorLast
        ? `${rows[0].authorFirst} ${rows[0].authorLast}`
        : null,
    authorInitials: rows[0].authorInitials,
    authorTone: rows[0].authorTone,
  };
}

export async function getNews(id: string): Promise<News | null> {
  const rows = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return rows[0] ?? null;
}

export type NewsAdminRow = News & {
  authorName: string | null;
  readCount: number;
};

/** Alle Beiträge (inkl. Entwürfe) für die Redaktion — mit Lesezahl pro Beitrag. */
export async function listNewsForAdmin(): Promise<NewsAdminRow[]> {
  const rows = await db
    .select({
      news,
      authorFirst: members.firstName,
      authorLast: members.lastName,
    })
    .from(news)
    .leftJoin(members, eq(members.id, news.authorId))
    .orderBy(desc(news.pinned), desc(news.updatedAt));

  const readRows = await db
    .select({ newsId: newsReads.newsId, count: sql<number>`count(*)::int` })
    .from(newsReads)
    .groupBy(newsReads.newsId);
  const readByNews = new Map(readRows.map((r) => [r.newsId, r.count]));

  return rows.map((r) => ({
    ...r.news,
    authorName: r.authorFirst && r.authorLast ? `${r.authorFirst} ${r.authorLast}` : null,
    readCount: readByNews.get(r.news.id) ?? 0,
  }));
}

/** Anzahl aktiver Mitglieder — Nenner für „X von Y gelesen". */
export async function getActiveMemberCount(): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(members)
    .where(eq(members.status, 'active'));
  return rows[0]?.count ?? 0;
}

/** Lesebestätigung setzen (idempotent). */
export async function markNewsRead(newsId: string, memberId: string): Promise<void> {
  await db.insert(newsReads).values({ newsId, memberId }).onConflictDoNothing();
}
