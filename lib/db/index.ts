import * as schema from './schema';

type DrizzleDb = ReturnType<typeof import('drizzle-orm/postgres-js').drizzle<typeof schema>>
  | ReturnType<typeof import('drizzle-orm/pglite').drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __db?: DrizzleDb;
  __dbDriver?: 'pglite' | 'postgres';
};

function makeDb(): DrizzleDb {
  const rawUrl = process.env.DATABASE_URL;
  if (rawUrl) {
    const { drizzle } = require('drizzle-orm/postgres-js');
    const postgres = require('postgres');
    // Serverless (Vercel) + Supabase: den TRANSACTION-Pooler (Port 6543) nutzen,
    // nicht den Session-Pooler (5432). Der Session-Pooler hält je Client-Verbindung
    // eine Server-Verbindung und läuft bei vielen Function-Instanzen voll → Seiten
    // mit DB-Zugriff hängen. Der Transaction-Pooler multiplext und ist dafür gebaut.
    // Migrationen (lib/db/migrate.ts) nutzen weiterhin die Original-URL.
    let url = rawUrl;
    try {
      const u = new URL(rawUrl);
      if (u.hostname.includes('pooler.supabase.com') && u.port === '5432') {
        u.port = '6543';
        url = u.toString();
      }
    } catch {
      // URL nicht parsebar → Original verwenden.
    }
    const client = postgres(url, {
      prepare: false, // Pflicht für den Transaction-Pooler (pgbouncer)
      max: 3,
      idle_timeout: 20, // Sekunden — Verbindung freigeben, wenn ungenutzt
      connect_timeout: 15, // Sekunden — nicht ewig auf den Pooler warten
    });
    globalForDb.__dbDriver = 'postgres';
    // Auch in Produktion je Instanz cachen, damit nicht pro Modul-Eval ein
    // neuer Pool entsteht.
    const pgDb: DrizzleDb = drizzle(client, { schema });
    globalForDb.__db = pgDb;
    return pgDb;
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
