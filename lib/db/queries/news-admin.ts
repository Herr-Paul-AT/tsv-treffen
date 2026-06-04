import { sql } from 'drizzle-orm';
import { rawRows } from '@/lib/db/raw';

export type NewsAdminStats = {
  published: number;
  publishedThisYear: number;
  drafts: number;
  scheduled: number;
  archived: number;
};

export async function getNewsAdminStats(): Promise<NewsAdminStats> {
  const currentYear = new Date().getFullYear();
  const rows = await rawRows<{
    published: number;
    published_this_year: number;
    drafts: number;
    scheduled: number;
    archived: number;
  }>(sql`
    SELECT
      COUNT(*) FILTER (WHERE published_at IS NOT NULL AND published_at <= NOW())::int AS published,
      COUNT(*) FILTER (WHERE published_at IS NOT NULL AND EXTRACT(YEAR FROM published_at)::int = ${currentYear})::int AS published_this_year,
      COUNT(*) FILTER (WHERE published_at IS NULL)::int AS drafts,
      COUNT(*) FILTER (WHERE published_at IS NOT NULL AND published_at > NOW())::int AS scheduled,
      0::int AS archived
    FROM news
  `);
  const r = rows[0] ?? { published: 0, published_this_year: 0, drafts: 0, scheduled: 0, archived: 0 };
  return {
    published: r.published,
    publishedThisYear: r.published_this_year,
    drafts: r.drafts,
    scheduled: r.scheduled,
    archived: r.archived,
  };
}
