import Link from 'next/link';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listNewsForAdmin, getActiveMemberCount } from '@/lib/db/queries/news';
import { getNewsAdminStats } from '@/lib/db/queries/news-admin';
import { formatDayMonth } from '@/lib/format';

export const dynamic = 'force-dynamic';

type Status = 'Veröffentlicht' | 'Entwurf' | 'Geplant';

const STATUS_TONE: Record<Status, BadgeTone> = {
  Veröffentlicht: 'forest',
  Entwurf: 'neutral',
  Geplant: 'sand',
};

function statusOf(publishedAt: Date | null): Status {
  if (!publishedAt) return 'Entwurf';
  return publishedAt > new Date() ? 'Geplant' : 'Veröffentlicht';
}

const COLS = 'grid-cols-[minmax(240px,1fr)_120px_100px_120px_100px_96px_44px]';

export default async function AdminNewsPage() {
  const [stats, rows, activeCount] = await Promise.all([
    getNewsAdminStats(),
    listNewsForAdmin(),
    getActiveMemberCount(),
  ]);

  const STATS = [
    { l: 'Veröffentlicht', v: String(stats.published), s: `${stats.publishedThisYear} in ${new Date().getFullYear()}`, tone: 'text-forest-700' },
    { l: 'Entwürfe', v: String(stats.drafts), s: stats.drafts === 0 ? 'alles raus' : 'in Arbeit', tone: 'text-stone-600' },
    { l: 'Geplant', v: String(stats.scheduled), s: stats.scheduled === 0 ? '—' : 'kommend', tone: 'text-sand-700' },
    { l: 'Aktive Leser:innen', v: String(activeCount), s: 'als Lese-Basis', tone: 'text-lake-700' },
  ];

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Redaktion
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">News</h1>
        </div>
        <Link href="/admin/news/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Neuer Beitrag
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
            <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{t.v}</div>
            <div className={`mt-2 text-[13px] font-medium ${t.tone}`}>{t.s}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className={`grid ${COLS} gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200`}>
          <span>Titel · Eyebrow</span>
          <span>Autor</span>
          <span>Datum</span>
          <span>Status</span>
          <span>Sichtbar</span>
          <span>Gelesen</span>
          <span />
        </div>
        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[14px] text-stone-500">Noch keine Beiträge.</div>
        )}
        {rows.map((p, i) => {
          const status = statusOf(p.publishedAt);
          const pct = activeCount > 0 ? Math.round((p.readCount / activeCount) * 100) : 0;
          return (
            <Link
              key={p.id}
              href={`/admin/news/${p.id}`}
              className={[
                `grid ${COLS} gap-3 px-5 py-3.5 items-center`,
                i % 2 ? '' : 'bg-paper-50/40',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
              ].join(' ')}
            >
              <div className="min-w-0 flex items-center gap-2">
                {p.pinned && <Icon.Pin size={14} className="text-sand-600 flex-none" />}
                <div className="min-w-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sand-700 truncate">
                    {p.eyebrow ?? '—'}
                  </div>
                  <div className="font-display text-[16.5px] text-stone-800 leading-tight mt-0.5 truncate">
                    {p.title}
                  </div>
                </div>
              </div>
              <span className="text-[13px] text-stone-700 truncate">{p.authorName ?? 'Vorstand'}</span>
              <span className="font-mono text-[12px] text-stone-600 uppercase tracking-[0.12em]">
                {p.publishedAt ? formatDayMonth(p.publishedAt) : '—'}
              </span>
              <Badge tone={STATUS_TONE[status]}>{status}</Badge>
              <Badge tone={p.visibility === 'public' ? 'lake' : 'dark'}>
                {p.visibility === 'public' ? 'Öffentl.' : 'Intern'}
              </Badge>
              <span className="text-[13px] text-stone-600">
                {status === 'Veröffentlicht' ? `${p.readCount} · ${pct}%` : '—'}
              </span>
              <span className="text-stone-400 inline-flex justify-end">
                <Icon.Edit size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
