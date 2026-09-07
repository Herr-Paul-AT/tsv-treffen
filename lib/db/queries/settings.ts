import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';

export type SiteSettings = {
  seasonYear: number;
  seasonOpening: string;
};

/**
 * Vom Verein pflegbare Einstellungen mit sinnvollen Defaults. Das Saison-Jahr
 * fällt auf das aktuelle Kalenderjahr zurück, wenn nichts gesetzt ist.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(siteSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const yearRaw = map.get('season_year');
  const seasonYear = yearRaw && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : new Date().getFullYear();
  return {
    seasonYear,
    seasonOpening: map.get('season_opening') ?? '',
  };
}
