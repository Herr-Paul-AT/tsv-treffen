import { MobileHeader } from '@/components/nav/MobileHeader';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { getCurrentMember } from '@/lib/db/queries/session';
import { getInvoicesForMember } from '@/lib/db/queries/dues';

export const dynamic = 'force-dynamic';

const STATUS_LABEL = {
  paid: 'Bezahlt',
  open: 'Offen',
  partial: 'Anteilig bezahlt',
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

export default async function BeitragskontoPage() {
  const me = await getCurrentMember();
  if (!me) {
    return (
      <>
        <MobileHeader title="Beitragskonto" backHref="/app/profil" />
        <div className="px-5 py-8 text-[14px] text-stone-500">Nicht angemeldet.</div>
      </>
    );
  }
  const invoices = await getInvoicesForMember(me.id);
  const totalCents = invoices.reduce((s, i) => s + i.amountCents, 0);
  const paidCents = invoices.reduce((s, i) => s + i.paidCents, 0);
  const openCents = totalCents - paidCents;

  return (
    <>
      <MobileHeader title="Beitragskonto" lead={`${me.firstName} ${me.lastName}`} backHref="/app/profil" />
      <div className="px-5 pb-8">
        <div className="bg-stone-800 text-paper-50 rounded-xl p-5 relative overflow-hidden">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
            Saldo {new Date().getFullYear()}
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[40px] leading-none">{eur(openCents)}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-100/60">
              {openCents === 0 ? 'alles beglichen' : 'offen'}
            </span>
          </div>
          <div className="mt-3 text-[12.5px] text-paper-100/70 leading-[1.55]">
            Soll {eur(totalCents)} · bezahlt {eur(paidCents)} ({invoices.length} Rechnungen)
          </div>
        </div>

        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500 mt-7 mb-2">
          Rechnungen
        </h3>
        <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
          {invoices.length === 0 && (
            <div className="px-5 py-8 text-center text-[14px] text-stone-500">
              Noch keine Rechnungen.
            </div>
          )}
          {invoices.map((inv) => (
            <div key={inv.invoiceId} className="px-5 py-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-paper-100 text-stone-700 inline-flex items-center justify-center flex-none">
                <Icon.Mail size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-medium text-stone-800 leading-tight">
                  Mitgliedsbeitrag {inv.dueDate.getFullYear()} · {inv.category}
                </div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 mt-1">
                  {inv.invoiceNumber} · fällig {inv.dueDate.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
                {inv.status === 'open' && inv.remindedAt && (
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-danger mt-1">
                    Mahnung verschickt am{' '}
                    {inv.remindedAt.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' })}
                  </div>
                )}
              </div>
              <div className="text-right flex-none">
                <div className="font-display text-[17px] text-stone-800 leading-none">
                  {eur(inv.amountCents)}
                </div>
                <div className="mt-1.5">
                  <Badge tone={STATUS_TONE[inv.status]}>{STATUS_LABEL[inv.status]}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-paper-50 border border-stone-200 rounded-lg p-4 flex gap-3">
          <Icon.Info size={18} className="text-lake-600 flex-none mt-0.5" />
          <p className="text-[13px] text-stone-600 leading-[1.55]">
            Beiträge per SEPA-Lastschrift oder Überweisung an{' '}
            <span className="font-mono text-stone-700">AT00 0000 0000 0000 0000</span>. Fragen zur
            Abrechnung an{' '}
            <a href="mailto:office@tsv-treffen.at" className="text-lake-700">
              office@tsv-treffen.at
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
