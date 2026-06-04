import Link from 'next/link';
import { MobileHeader } from '@/components/nav/MobileHeader';
import { NewsCard } from '@/components/cards/NewsCard';
import { listNews } from '@/lib/db/queries/news';
import { formatDayMonth } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function NewsListPage() {
  const items = await listNews(20);

  return (
    <>
      <MobileHeader title="News" lead="Aus dem Verein" backHref="/app/dashboard" />
      <div className="px-5 pb-8 space-y-4">
        {items.length === 0 && (
          <p className="text-[15px] text-stone-600 leading-[1.6] mt-4">
            Noch keine Beiträge. Sobald der Vorstand etwas veröffentlicht, erscheint es hier.
          </p>
        )}
        {items.map((it) => (
          <Link key={it.id} href={`/app/news/${it.slug}`} className="block">
            <NewsCard
              pinned={it.pinned}
              eyebrow={it.eyebrow ?? 'Verein'}
              title={it.title}
              excerpt={it.excerpt}
              image={it.imageKind === 'sand' ? 'sand' : 'lake'}
              date={it.publishedAt ? formatDayMonth(it.publishedAt) : 'Entwurf'}
              author={it.authorName ?? 'Vorstand'}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
