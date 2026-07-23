import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TSVMark } from '@/components/brand/Logo';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getNewsBySlug } from '@/lib/db/queries/news';
import { formatDayMonth } from '@/lib/format';

export const dynamic = 'force-dynamic';

const EYEBROW_TONE: Record<string, BadgeTone> = {
  Saisoneröffnung: 'sand',
  Mannschaftsspiel: 'lake',
  Vereinsmeisterschaft: 'sand',
  Bezirksliga: 'lake',
};

export default async function PublicNewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  // Nur veröffentlichte, öffentliche Beiträge sind hier sichtbar.
  if (!article || article.visibility !== 'public' || !article.publishedAt) notFound();

  const paragraphs = article.body.split(/\n\n+/);
  const heroClass =
    article.imageKind === 'sand' ? 'ph-sand' : article.imageKind === 'forest' ? 'ph-forest' : 'ph-lake';
  const tone: BadgeTone = (article.eyebrow ? EYEBROW_TONE[article.eyebrow] : undefined) ?? 'lake';

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className={`relative h-[240px] sm:h-[300px] ${heroClass}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            href="/news"
            aria-label="Zurück zu den News"
            className="h-11 pl-3 pr-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 text-stone-700 shadow-card text-[14px] font-medium"
          >
            <Icon.ArrowLeft size={18} /> News
          </Link>
          <Link href="/" aria-label="Zur Startseite" className="inline-flex">
            <span className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-white/90 shadow-card">
              <TSVMark size={26} variant="color" />
            </span>
          </Link>
        </div>
      </div>

      <div className="px-5 -mt-10 pb-16 relative max-w-2xl mx-auto">
        <article className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 shadow-card">
          <div className="flex items-center gap-2 flex-wrap">
            {article.eyebrow && <Badge tone={tone}>{article.eyebrow}</Badge>}
            <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
              {formatDayMonth(article.publishedAt)} {article.publishedAt.getFullYear()}
            </span>
          </div>
          <h1 className="font-display text-[28px] sm:text-[36px] leading-[1.08] text-stone-800 mt-3">
            {article.title}
          </h1>
          {article.authorName && (
            <div className="mt-4 font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] pb-4 border-b border-stone-100">
              {article.authorName} · TSV Schloss Treffen
            </div>
          )}
          <div className="mt-5 text-[16px] text-stone-700 leading-[1.65] space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {article.attachmentUrl && (
            <a
              href={article.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 h-11 px-4 rounded-md border border-stone-200 bg-paper-50 text-[14px] font-medium text-stone-800 hover:border-stone-300"
            >
              <Icon.Document size={16} /> {article.attachmentName ?? 'Anhang ansehen'}
            </a>
          )}
        </article>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-lake-700 hover:text-lake-800"
          >
            <Icon.ArrowLeft size={14} /> Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
