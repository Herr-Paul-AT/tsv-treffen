import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listMembersFiltered, getMemberStats, type MemberRow } from '@/lib/db/queries/members';
import type { Member } from '@/lib/db/schema';

const STATUSES: Member['status'][] = ['active', 'probe', 'paused', 'inactive'];
const DUES: Member['paymentStatus'][] = ['paid', 'open', 'partial', 'waived'];
const PAGE_SIZE = 25;

export const dynamic = 'force-dynamic';

type StatusLabel = 'Aktiv' | 'Pausiert' | 'Probe' | 'Inaktiv';
type DuesLabel = 'Bezahlt' | 'Offen' | 'Anteilig' | 'Erlassen';

const STATUS_LABEL: Record<Member['status'], StatusLabel> = {
  active: 'Aktiv',
  paused: 'Pausiert',
  probe: 'Probe',
  inactive: 'Inaktiv',
};

const STATUS_TONE: Record<StatusLabel, BadgeTone> = {
  Aktiv: 'lake',
  Pausiert: 'neutral',
  Probe: 'sand',
  Inaktiv: 'dark',
};

const DUES_LABEL: Record<Member['paymentStatus'], DuesLabel> = {
  paid: 'Bezahlt',
  open: 'Offen',
  partial: 'Anteilig',
  waived: 'Erlassen',
};

const DUES_TONE: Record<DuesLabel, BadgeTone> = {
  Bezahlt: 'forest',
  Offen: 'danger',
  Anteilig: 'warn',
  Erlassen: 'dark',
};

function formatEuro(cents: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{
    imported?: string;
    dupes?: string;
    invalid?: string;
    q?: string;
    status?: string;
    dues?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const importedCount = sp.imported ? Number(sp.imported) : null;

  const q = (sp.q ?? '').trim();
  const statusParam = STATUSES.includes(sp.status as Member['status'])
    ? (sp.status as Member['status'])
    : undefined;
  const duesParam = DUES.includes(sp.dues as Member['paymentStatus'])
    ? (sp.dues as Member['paymentStatus'])
    : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const hasFilter = Boolean(q || statusParam || duesParam);

  const [result, stats] = await Promise.all([
    listMembersFiltered({
      search: q || undefined,
      status: statusParam,
      dues: duesParam,
      page,
      pageSize: PAGE_SIZE,
    }),
    getMemberStats(),
  ]);
  const { rows, total, totalPages } = result;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  function pageHref(p: number): string {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (statusParam) params.set('status', statusParam);
    if (duesParam) params.set('dues', duesParam);
    if (p > 1) params.set('page', String(p));
    const s = params.toString();
    return `/admin/mitglieder${s ? `?${s}` : ''}`;
  }

  const statsTiles = [
    { l: 'Gesamt', v: String(stats.total), s: `+${stats.joinedThisYear} in ${new Date().getFullYear()}`, tone: 'text-lake-700' },
    { l: 'Aktiv', v: String(stats.active), s: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)} % Anteil` : '—', tone: 'text-forest-700' },
    { l: 'Beiträge offen', v: String(stats.paymentsOpen), s: formatEuro(stats.paymentsOpenCents), tone: 'text-danger' },
    { l: 'Probemitgl.', v: String(stats.probe), s: `${stats.probeInProgress} in Bearbeitung`, tone: 'text-sand-700' },
  ];

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Mitglieder
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/mitglieder/export" download>
            <Button variant="secondary" icon={<Icon.Download size={16} />}>
              Export CSV
            </Button>
          </a>
          <Link href="/admin/mitglieder/import">
            <Button variant="secondary" icon={<Icon.Upload size={16} />}>
              Importieren
            </Button>
          </Link>
          <Link href="/admin/mitglieder/neu">
            <Button variant="primary" icon={<Icon.Plus size={16} />}>
              Mitglied anlegen
            </Button>
          </Link>
        </div>
      </div>

      {importedCount !== null && (
        <div className="mt-5 flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-lg px-5 py-3.5">
          <Icon.Check size={18} className="text-forest-700" />
          <span className="text-[14px] text-forest-800">
            <strong>{importedCount}</strong>{' '}
            {importedCount === 1 ? 'Mitglied importiert' : 'Mitglieder importiert'}
            {Number(sp.dupes) > 0 && ` · ${sp.dupes} Dublette(n) übersprungen`}
            {Number(sp.invalid) > 0 && ` · ${sp.invalid} fehlerhafte Zeile(n) übersprungen`}
            .
          </span>
        </div>
      )}

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsTiles.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
              {t.l}
            </div>
            <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">
              {t.v}
            </div>
            <div className={`mt-2 text-[13px] font-medium ${t.tone}`}>{t.s}</div>
          </div>
        ))}
      </div>

      {/* Filters (GET-Form) */}
      <form method="get" action="/admin/mitglieder" className="mt-6 flex items-center gap-2.5 flex-wrap">
        <div className="flex-1 h-11 bg-white rounded-md border border-stone-200 px-4 flex items-center gap-2.5 max-w-md min-w-[240px] focus-within:border-lake-500 focus-within:ring-2 focus-within:ring-lake-500/15">
          <Icon.Search size={16} className="text-stone-400" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            className="flex-1 bg-transparent text-[14px] outline-none"
            placeholder="Suche nach Name oder E-Mail…"
          />
        </div>
        <select
          name="status"
          defaultValue={statusParam ?? ''}
          className="h-11 px-3 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700 outline-none focus:border-lake-500"
        >
          <option value="">Status: alle</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          name="dues"
          defaultValue={duesParam ?? ''}
          className="h-11 px-3 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700 outline-none focus:border-lake-500"
        >
          <option value="">Beitrag: alle</option>
          {DUES.map((d) => (
            <option key={d} value={d}>
              {DUES_LABEL[d]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" icon={<Icon.Search size={15} />}>
          Suchen
        </Button>
        {hasFilter && (
          <Link
            href="/admin/mitglieder"
            className="h-11 px-3 inline-flex items-center text-[13px] font-medium text-stone-500 hover:text-stone-700"
          >
            Zurücksetzen
          </Link>
        )}
        <span className="ml-auto font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
          {total === 0 ? '0' : `${from}–${to}`} von {total}
          {hasFilter && total !== stats.total ? ` (gefiltert)` : ''}
        </span>
      </form>

      {/* Table */}
      <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-[minmax(220px,1fr)_140px_120px_80px_120px_40px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
          <span>Name · E-Mail</span>
          <span>Mannschaft</span>
          <span>Status</span>
          <span>LK</span>
          <span>Beitrag {String(new Date().getFullYear()).slice(2)}</span>
          <span />
        </div>
        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[14px] text-stone-500">
            Keine Mitglieder gefunden{hasFilter ? ' — Filter anpassen oder zurücksetzen.' : '.'}
          </div>
        )}
        {rows.map((r: MemberRow, i: number) => {
          const statusLabel = STATUS_LABEL[r.status];
          const duesLabel = DUES_LABEL[r.paymentStatus];
          return (
            <Link
              key={r.id}
              href={`/admin/mitglieder/${r.id}`}
              className={[
                'grid grid-cols-[minmax(220px,1fr)_140px_120px_80px_120px_40px] gap-3 px-5 py-3 items-center',
                i % 2 ? '' : 'bg-paper-50/40',
                'border-b border-stone-100 last:border-b-0 hover:bg-paper-50 transition-colors',
              ].join(' ')}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar initials={r.initials} size={36} tone={r.avatarTone as AvatarTone} />
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-stone-800 leading-tight truncate">
                    {r.firstName} {r.lastName}
                  </div>
                  <div className="font-mono text-[11px] text-stone-500 truncate">{r.email ?? '—'}</div>
                </div>
              </div>
              <span className="text-[13.5px] text-stone-700">{r.teamName ?? '—'}</span>
              <Badge tone={STATUS_TONE[statusLabel]}>{statusLabel}</Badge>
              <span className="font-mono text-[12.5px] text-stone-700">{r.lkRating ?? '—'}</span>
              <Badge tone={DUES_TONE[duesLabel]}>{duesLabel}</Badge>
              <span className="text-stone-400 inline-flex justify-end">
                <Icon.Edit size={16} />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
          <span>Seite {page} von {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <PageLink href={pageHref(page - 1)} disabled={page <= 1} aria="Vorherige Seite">
              <Icon.ArrowLeft size={14} />
            </PageLink>
            {pageWindow(page, totalPages).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                className={[
                  'w-10 h-10 rounded-md text-[13px] font-medium inline-flex items-center justify-center',
                  n === page
                    ? 'bg-stone-800 text-paper-50'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-paper-50',
                ].join(' ')}
              >
                {n}
              </Link>
            ))}
            <PageLink href={pageHref(page + 1)} disabled={page >= totalPages} aria="Nächste Seite">
              <Icon.ArrowRight size={14} />
            </PageLink>
          </div>
        </div>
      )}
    </main>
  );
}

function pageWindow(page: number, totalPages: number): number[] {
  const span = 5;
  let start = Math.max(1, page - Math.floor(span / 2));
  const end = Math.min(totalPages, start + span - 1);
  start = Math.max(1, end - span + 1);
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function PageLink({
  href,
  disabled,
  aria,
  children,
}: {
  href: string;
  disabled: boolean;
  aria: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="w-10 h-10 rounded-md bg-white border border-stone-100 inline-flex items-center justify-center text-stone-300"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={aria}
      className="w-10 h-10 rounded-md bg-white border border-stone-200 inline-flex items-center justify-center text-stone-600 hover:bg-paper-50"
    >
      {children}
    </Link>
  );
}
