import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@electric-sql/pglite'],
  experimental: {
    // Logos/Flyer per Server-Action hochladen (Standard wäre 1 MB).
    // Handyfotos sind oft 5–12 MB; sie werden serverseitig verkleinert (lib/supabase/storage.ts).
    serverActions: { bodySizeLimit: '20mb' },
  },
};

export default withSerwist(nextConfig);
