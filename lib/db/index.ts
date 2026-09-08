import * as schema from './schema';

type DrizzleDb = ReturnType<typeof import('drizzle-orm/postgres-js').drizzle<typeof schema>>
  | ReturnType<typeof import('drizzle-orm/pglite').drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __db?: DrizzleDb;
  __dbDriver?: 'pglite' | 'postgres';
};

function makeDb(): DrizzleDb {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { drizzle } = require('drizzle-orm/postgres-js');
    const postgres = require('postgres');
    // Supabase Session-Pooler (Port 5432) + postgres-js. WICHTIG: NICHT auf den
    // Transaction-Pooler (6543) umstellen — postgres-js hängt dort bei parallelen
    // Queries (z. B. die 11 der Startseite). Der Session-Pooler verträgt die
    // Parallelität problemlos. idle_timeout gibt ungenutzte Verbindungen frei,
    // damit sie sich über warme Serverless-Instanzen nicht ansammeln.
    const client = postgres(url, { prepare: false, max: 5, idle_timeout: 20 });
    globalForDb.__dbDriver = 'postgres';
    return drizzle(client, { schema });
  }
  // Dev only: embedded PGlite. Not bundled in production (env-gated above).
  const path = require('node:path');
  const { drizzle } = require('drizzle-orm/pglite');
  const { PGlite } = require('@electric-sql/pglite');
  const dataDir = path.resolve(
    process.cwd(),
    process.env.PGLITE_DATA_DIR ?? './data/pglite',
  );
  const client = new PGlite({ dataDir });
  globalForDb.__dbDriver = 'pglite';
  return drizzle(client, { schema });
}

export const db: DrizzleDb = globalForDb.__db ?? makeDb();
if (process.env.NODE_ENV !== 'production') globalForDb.__db = db;

export const dbDriver = globalForDb.__dbDriver ?? 'pglite';
export { schema };
