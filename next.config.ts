import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@electric-sql/pglite'],
  experimental: {
    // Logos/Flyer per Server-Action hochladen (Standard wäre 1 MB).
    serverActions: { bodySizeLimit: '6mb' },
  },
};

export default withSerwist(nextConfig);
