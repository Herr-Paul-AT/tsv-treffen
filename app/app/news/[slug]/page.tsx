import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FollowButton, StarToggle } from '@/components/feedback/NewsActions';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { AvatarTone } from '@/components/ui/Avatar';
import { getNewsBySlug, markNewsRead } from '@/lib/db/queries/news';
import { getCurrentMember } from '@/lib/db/queries/session';
import { formatDayMonth } from '@/lib/format';

export const dynamic = 'force-dynamic';

const EYEBROW_TONE: Record<string, BadgeTone> = {
  Saisoneröffnung: 'sand',
  Mannschaftsspiel: 'lake',
  Vereinsmeisterschaft: 'sand',
  Bezirksliga: 'lake',
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  // Lesebestätigung setzen, sobald ein Mitglied einen veröffentlichten Beitrag öffnet.
  if (article.publishedAt) {
    const me = await getCurrentMember();
    if (me) await markNewsRead(article.id, me.id);
  }

  const paragraphs = article.body.split(/\n\n+/);
  const heroClass = article.imageKind === 'sand' ? 'ph-sand' : article.imageKind === 'forest' ? 'ph-forest' : 'ph-lake';
  const tone: BadgeTone = (article.eyebrow ? EYEBROW_TONE[article.eyebrow] : undefined) ?? 'lake';

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className={`relative h-[280px] ${heroClass}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Link
            href="/app/news"
            aria-label="Zurück"
            className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-card"
          >
            <Icon.ArrowLeft />
          </Link>
          <div className="flex gap-2">
            <StarToggle />
            <button
              type="button"
              aria-label="Weitere Aktionen"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-card"
            >
              <Icon.More />
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 -mt-10 pb-12 relative max-w-2xl mx-auto">
        <article className="bg-white rounded-xl border border-stone-200 p-5 sm:p-7 shadow-card">
          <div className="flex items-center gap-2 flex-wrap">
            {article.eyebrow && <Badge tone={tone}>{article.eyebrow}</Badge>}
            {article.publishedAt && (
              <span className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
                {formatDayMonth(article.publishedAt)} {article.publishedAt.getFullYear()}
              </span>
            )}
          </div>
          <h1 className="font-display text-[28px] sm:text-[36px] leading-[1.08] text-stone-800 mt-3">
            {article.title}
          </h1>
          {article.authorName && (
            <div className="mt-5 flex items-center gap-3 pb-4 border-b border-stone-100">
              <Avatar
                initials={article.authorInitials ?? '??'}
                size={40}
                tone={(article.authorTone as AvatarTone) ?? 'lake'}
              />
              <div className="flex-1">
                <div className="text-[14px] font-medium text-stone-800">{article.authorName}</div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
                  Verein
                </div>
              </div>
              <FollowButton />
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
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-4 flex-wrap">
            <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
              Noch keine Kommentare
            </span>
          </div>
        </article>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="lg" icon={<Icon.Calendar size={16} />} className="flex-1">
            In Kalender
          </Button>
        </div>
      </div>
    </main>
  );
}
