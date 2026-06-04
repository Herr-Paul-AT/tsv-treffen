import type { SQL } from 'drizzle-orm';
import { db } from './index';

/**
 * Normalises db.execute() across drivers: PGlite returns `{ rows: [...] }`,
 * postgres-js returns the rows array directly. This helper hides the
 * difference so query files stay type-clean and driver-agnostic.
 */
export async function rawRows<T = Record<string, unknown>>(query: SQL): Promise<T[]> {
  const result = await db.execute(query);
  // PGlite: { rows: T[] }; postgres-js: T[]
  if (Array.isArray(result)) return result as T[];
  if (result && typeof result === 'object' && 'rows' in result) {
    return (result as { rows: T[] }).rows;
  }
  return [];
}
