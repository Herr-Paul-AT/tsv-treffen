import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { getDuesStats, listInvoicesForYear } from '@/lib/db/queries/dues';

export const dynamic = 'force-dynamic';

const STATUS_LABEL = {
  paid: 'Bezahlt',
  open: 'Offen',
  partial: 'Anteilig',
  waived: 'Erlassen',
} as const;

const STATUS_TONE: Record<keyof typeof STATUS_LABEL, BadgeTone> = {
  paid: 'forest',
  open: 'danger',
  partial: 'warn',
  waived: 'dark',
};

function eur(cents: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function AdminDuesPage() {
  const year = new Date().getFullYear();
  const [stats, invoices] = await Promise.all([getDuesStats(year), listInvoicesForYear(year)]);

  const STATS = [
    { l: 'Soll gesamt', v: eur(stats.totalCents), s: `${invoices.length} Rechnungen`, tone: 'text-stone-800' },
    { l: 'Eingegangen', v: eur(stats.paidCents), s: `${Math.round(stats.collectionRate * 100)} % Quote`, tone: 'text-forest-700' },
    { l: 'Offen', v: eur(stats.openCents), s: `${stats.invoicesOpen + stats.invoicesPartial} Mitglieder`, tone: 'text-danger' },
    { l: 'Bezahlt', v: String(stats.invoicesPaid), s: 'Rechnungen', tone: 'text-lake-700' },
  ];

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Finanzen
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
            Beiträge {year}
          </h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-xl">
            Mitgliedsbeiträge nach Kategorie, Mahnstatus und Eingang. SEPA-Lastschrift exportierbar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Icon.Download size={16} />}>
            SEPA-XML exportieren
          </Button>
          <Button variant="primary" icon={<Icon.Mail size={16} />}>
            Mahnungen senden
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
            <div className={`font-display text-[28px] mt-1 leading-none ${t.tone}`}>{t.v}</div>
            <div className="mt-2 text-[12.5px] font-medium text-stone-600">{t.s}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <div className="flex-1 h-11 bg-white rounded-md border border-stone-200 px-4 flex items-center gap-2.5 max-w-md min-w-[260px]">
          <Icon.Search size={16} className="text-stone-400" />
          <input
            type="search"
            className="flex-1 bg-transparent text-[14px] outline-none"
            placeholder="Name, Rechnungsnummer…"
          />
        </div>
        <button
          type="button"
          className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700"
        >
          Status <Icon.ChevronDown size={14} className="text-stone-400" />
        </button>
        <button
          type="button"
          className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-white border border-stone-200 text-[14px] text-stone-700"
        >
          Kategorie <Icon.ChevronDown size={14} className="text-stone-400" />
        </button>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-[minmax(220px,1fr)_100px_120px_120px_100px_120px_40px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
          <span>Mitglied · Rechnung</span>
          <span>Kategorie</span>
          <span>Betrag</span>
          <span>Bezahlt</span>
          <span>Fällig</span>
          <span>Status</span>
          <span />
        </div>
        {invoices.map((r, i) => (
          <div
            key={r.invoiceId}
            className={[
              'grid grid-cols-[minmax(220px,1fr)_100px_120px_120px_100px_120px_40px] gap-3 px-5 py-3 items-center',
              i % 2 ? '' : 'bg-paper-50/40',
              'border-b border-stone-100 last:border-b-0',
            ].join(' ')}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar initials={r.initials} size={32} tone={r.avatarTone as AvatarTone} />
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-stone-800 leading-tight truncate">{r.memberName}</div>
                <div className="font-mono text-[10.5px] text-stone-500 uppercase tracking-[0.14em]">
                  {r.invoiceNumber ?? '—'}
                </div>
              </div>
            </div>
            <span className="text-[12.5px] text-stone-700 capitalize">{r.category}</span>
            <span className="font-display text-[15px] text-stone-800">{eur(r.amountCents)}</span>
            <span className="text-[13.5px] text-stone-700">{eur(r.paidCents)}</span>
            <span className="font-mono text-[12px] text-stone-600 uppercase tracking-[0.1em]">
              {r.dueDate.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' })}
              {r.daysOverdue > 0 && r.status !== 'paid' && r.status !== 'waived' && (
                <div className="text-[10.5px] text-danger uppercase tracking-[0.14em] mt-0.5">
                  +{r.daysOverdue} T
                </div>
              )}
            </span>
            <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            <button
              type="button"
              aria-label="Weitere Aktionen"
              className="text-stone-400 hover:text-stone-700 w-8 h-8 rounded-md inline-flex items-center justify-center hover:bg-stone-100"
            >
              <Icon.More size={16} />
            </button>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="px-5 py-10 text-center text-[14px] text-stone-500">Noch keine Rechnungen für {year}.</div>
        )}
      </div>
    </main>
  );
}
