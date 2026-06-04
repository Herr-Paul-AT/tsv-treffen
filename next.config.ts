import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@electric-sql/pglite'],
};

export default withSerwist(nextConfig);
