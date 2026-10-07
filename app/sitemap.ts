import type { MetadataRoute } from 'next';
import { listNews } from '@/lib/db/queries/news';
import { listUpcomingEvents } from '@/lib/db/queries/events';
import { SITE_URL } from '@/lib/site';

// Stündlich neu erzeugen — neue News/Veranstaltungen landen so automatisch in der Sitemap.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/mitglied-werden`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/galerie`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/impressum`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/datenschutz`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    // Sequenziell (Serverless + Supabase-Pooler).
    const news = await listNews(100, { publicOnly: true });
    for (const n of news) {
      pages.push({
        url: `${SITE_URL}/news/${n.slug}`,
        lastModified: n.updatedAt ?? n.publishedAt ?? now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
    const events = await listUpcomingEvents(50);
    for (const e of events) {
      pages.push({
        url: `${SITE_URL}/veranstaltung/${e.id}`,
        lastModified: e.createdAt ?? now,
        changeFrequency: 'weekly',
        priority: e.registrationOpen ? 0.7 : 0.4,
      });
    }
  } catch {
    // Datenbank kurz nicht erreichbar → wenigstens die festen Seiten ausliefern.
  }
  return pages;
}
