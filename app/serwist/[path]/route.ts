import { createSerwistRoute } from '@serwist/turbopack';

const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now().toString();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'app/sw.ts',
  useNativeEsbuild: true,
});
