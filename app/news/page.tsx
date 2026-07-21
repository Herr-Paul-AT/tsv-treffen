import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { listNews } from '@/lib/db/queries/news';
import { formatDayMonth } from '@/lib/format';

export const dynamic = 'force-dynamic';

const EYEBROW_TONE: Record<string, string> = {
  Saisoneröffnung: 'text-sand-700',
  Mannschaftsspiel: 'text-lake-700',
  Vereinsmeisterschaft: 'text-sand-700',
};

export default async function PublicNewsListPage() {
  const news = await listNews(50, { publicOnly: true });

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-[1080px] mx-auto px-5 pt-10 pb-16">
        <Link href="/" aria-label="Zur Startseite" className="inline-block">
          <TSVMark size={56} variant="color" />
        </Link>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
        >
          <Icon.ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        <div className="mt-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            Neuigkeiten
          </span>
          <h1 className="font-display text-[32px] sm:text-[40px] leading-[1.05] text-stone-800 mt-2">
            Aus dem Verein.
          </h1>
        </div>

        {news.length === 0 ? (
          <p className="mt-8 text-[15px] text-stone-500">Aktuell keine Neuigkeiten.</p>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n) => {
              const tone = (n.eyebrow && EYEBROW_TONE[n.eyebrow]) ?? 'text-stone-600';
              return (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  className="bg-white rounded-lg border border-stone-200 overflow-hidden group transition-all hover:border-stone-300 hover:shadow-card hover:-translate-y-0.5"
                >
                  <div
                    className={`h-44 ${
                      n.imageKind === 'sand' ? 'ph-sand' : n.imageKind === 'forest' ? 'ph-forest' : 'ph-lake'
                    }`}
                  />
                  <div className="p-5">
                    <span className={`font-mono text-[11px] uppercase tracking-[0.16em] ${tone}`}>
                      {n.eyebrow ?? 'Verein'}
                    </span>
                    <h3 className="font-display text-[19px] text-stone-800 mt-1.5 leading-[1.2]">
                      {n.title}
                    </h3>
                    <p className="text-[13.5px] text-stone-600 mt-2.5 leading-[1.55] line-clamp-2">
                      {n.excerpt}
                    </p>
                    <div className="font-mono text-[11px] text-stone-500 mt-3 uppercase tracking-[0.14em]">
                      {n.publishedAt ? `${formatDayMonth(n.publishedAt)} ${n.publishedAt.getFullYear()}` : ''}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
