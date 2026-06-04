import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.PGLITE_DATA_DIR ?? './data/pglite',
  },
  verbose: true,
  strict: true,
});
