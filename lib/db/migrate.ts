import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator';
import { migrate as migratePg } from 'drizzle-orm/postgres-js/migrator';

const dataDir = process.env.PGLITE_DATA_DIR ?? './data/pglite';
const migrationsFolder = './lib/db/migrations';

async function main() {
  const url = process.env.DATABASE_URL;

  if (url) {
    const postgres = (await import('postgres')).default;
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const client = postgres(url, { max: 1, prepare: false });
    const db = drizzle(client);
    console.log('Running migrations against Postgres (DATABASE_URL)…');
    await migratePg(db, { migrationsFolder });
    await client.end();
  } else {
    const { PGlite } = await import('@electric-sql/pglite');
    const { drizzle } = await import('drizzle-orm/pglite');
    const client = new PGlite(dataDir);
    const db = drizzle(client);
    console.log(`Running migrations against ${dataDir} (PGlite)…`);
    await migratePglite(db, { migrationsFolder });
    await client.close();
  }
  console.log('Migrations complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
