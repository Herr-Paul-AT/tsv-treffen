import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Öffentliche Seiten indexierbar; Mitglieder-, Admin- und Login-Bereich gesperrt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/admin/', '/api/', '/auth/', '/login', '/mitglied-werden/danke'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
