import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

const dataDir = process.env.PGLITE_DATA_DIR ?? './data/pglite';

async function main() {
  const client = new PGlite(dataDir);
  const db = drizzle(client);
  console.log(`Running migrations against ${dataDir}…`);
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  console.log('Migrations complete.');
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
