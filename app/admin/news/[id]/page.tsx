import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { NewsForm } from '@/components/admin/NewsForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteNews, updateNews } from '@/lib/actions/news';
import { getNews, getActiveMemberCount, listNewsForAdmin } from '@/lib/db/queries/news';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, activeCount, adminRows] = await Promise.all([
    getNews(id),
    getActiveMemberCount(),
    listNewsForAdmin(),
  ]);
  if (!article) notFound();

  const readCount = adminRows.find((r) => r.id === id)?.readCount ?? 0;
  const pct = activeCount > 0 ? Math.round((readCount / activeCount) * 100) : 0;
  const isPublished = article.publishedAt != null;

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Redaktion
      </Link>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Beitrag bearbeiten
          </div>
          <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-0.5">
            {article.title}
          </h1>
        </div>
        <Badge tone={isPublished ? 'forest' : 'neutral'}>
          {isPublished ? 'Veröffentlicht' : 'Entwurf'}
        </Badge>
        <Badge tone={article.visibility === 'public' ? 'lake' : 'dark'}>
          {article.visibility === 'public' ? 'Öffentlich' : 'Intern'}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
        <NewsForm action={updateNews} article={article} submitLabel="Änderungen speichern" />

        <aside className="mt-8 bg-stone-800 text-paper-50 rounded-lg p-5">
          <h2 className="font-display text-[18px]">Lesebestätigung</h2>
          {isPublished ? (
            <>
              <div className="mt-3 font-display text-[40px] leading-none">
                {readCount}
                <span className="text-[20px] text-paper-100/60"> / {activeCount}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-sand-300">
                aktive Mitglieder · {pct} %
              </div>
              <div className="mt-3 h-2 rounded-full bg-paper-50/15 overflow-hidden">
                <div className="h-full bg-sand-400" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-3 text-[12.5px] text-paper-100/70 leading-snug">
                Wird gezählt, sobald ein Mitglied den Beitrag im Mitgliederbereich öffnet.
              </p>
            </>
          ) : (
            <p className="mt-3 text-[13px] text-paper-100/70 leading-snug">
              Noch nicht veröffentlicht — Lesebestätigungen werden erst nach dem Veröffentlichen
              gezählt.
            </p>
          )}
        </aside>
      </div>

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Der Beitrag wird dauerhaft entfernt — auch aus Mitgliederbereich und Startseite.
        </p>
        <DeleteButton
          action={deleteNews}
          id={article.id}
          label="Beitrag löschen"
          confirmText={`„${article.title}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
