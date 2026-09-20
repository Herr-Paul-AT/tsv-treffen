import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';

export type SiteSettings = {
  seasonYear: number;
  seasonOpening: string;
  foundingYear: number;
};

// Gründungsjahr laut Vorstand (Gert, Sept. 2026) — im Admin änderbar.
const DEFAULT_FOUNDING_YEAR = 1978;

/**
 * Vom Verein pflegbare Einstellungen mit sinnvollen Defaults. Das Saison-Jahr
 * fällt auf das aktuelle Kalenderjahr zurück, wenn nichts gesetzt ist.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(siteSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const yearRaw = map.get('season_year');
  const seasonYear = yearRaw && /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : new Date().getFullYear();
  const foundRaw = map.get('founding_year');
  const foundingYear = foundRaw && /^\d{4}$/.test(foundRaw) ? Number(foundRaw) : DEFAULT_FOUNDING_YEAR;
  return {
    seasonYear,
    seasonOpening: map.get('season_opening') ?? '',
    foundingYear,
  };
}
