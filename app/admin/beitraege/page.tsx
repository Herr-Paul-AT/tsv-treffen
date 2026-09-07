import Link from 'next/link';
import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { listDuesMembers } from '@/lib/db/queries/members';
import { memberCategoryLabel } from '@/lib/member-categories';
import { sendDuesReminders, resetDuesStatus } from '@/lib/actions/dues';

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
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminDuesPage({
  searchParams,
}: {
  searchParams: Promise<{ offen?: string; reminded?: string; nomail?: string; reset?: string; mailoff?: string }>;
}) {
  const sp = await searchParams;
  const year = new Date().getFullYear();
  const onlyOpen = sp.offen === '1';

  const all = await listDuesMembers(false);
  const openMembers = all.filter((m) => m.paymentStatus === 'open' || m.paymentStatus === 'partial');
  const paidCount = all.filter((m) => m.paymentStatus === 'paid').length;
  const openCents = openMembers.reduce((s, m) => s + m.paymentDueCents, 0);
  const openWithMail = openMembers.filter((m) => m.email).length;

  const rows = onlyOpen ? openMembers : all;

  const STATS = [
    { l: 'Mitglieder', v: String(all.length), s: `${year}`, tone: 'text-stone-800' },
    { l: 'Bezahlt', v: String(paidCount), s: 'Mitglieder', tone: 'text-forest-700' },
    { l: 'Offen', v: String(openMembers.length), s: `${openWithMail} mit E-Mail`, tone: 'text-danger' },
    { l: 'Offener Betrag', v: eur(openCents), s: 'gesamt', tone: 'text-stone-800' },
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
            Beitragsstatus je Mitglied (manueller Abgleich). Offene Beiträge kannst du per
            Zahlungserinnerung anmahnen und zum Jahreswechsel zurücksetzen.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConfirmSubmit
            action={sendDuesReminders}
            label="Mahnungen senden"
            variant="primary"
            icon={<Icon.Mail size={16} />}
            confirmText={`Zahlungserinnerung an ${openWithMail} Mitglied(er) mit offenem Beitrag und hinterlegter E-Mail senden?`}
          />
          <ConfirmSubmit
            action={resetDuesStatus}
            label="Jahres-Reset"
            variant="secondary"
            icon={<Icon.Sun size={16} />}
            confirmText="Alle Beiträge (außer „erlassen“) wieder auf „offen“ setzen? Danach beginnt der manuelle Abgleich für die neue Saison neu."
          />
        </div>
      </div>

      {/* Rückmeldungen */}
      {sp.reminded != null && (
        <div className="mt-5 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
          <Icon.Check size={16} className="flex-none mt-0.5" />
          <span>
            {sp.reminded} Zahlungserinnerung(en) versendet.
            {Number(sp.nomail) > 0 && ` ${sp.nomail} offene(s) Mitglied(er) ohne E-Mail wurden übersprungen.`}
          </span>
        </div>
      )}
      {sp.reset != null && (
        <div className="mt-5 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
          <Icon.Check size={16} className="flex-none mt-0.5" />
          <span>{sp.reset} Beitrag/Beiträge auf „offen" zurückgesetzt.</span>
        </div>
      )}
      {sp.mailoff != null && (
        <div className="mt-5 flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>E-Mail-Versand ist nicht konfiguriert — es wurden keine Erinnerungen gesendet.</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((t) => (
          <div key={t.l} className="bg-white rounded-lg border border-stone-200 p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">{t.l}</div>
            <div className={`font-display text-[28px] mt-1 leading-none ${t.tone}`}>{t.v}</div>
            <div className="mt-2 text-[12.5px] font-medium text-stone-600">{t.s}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Link
          href="/admin/beitraege"
          className={`h-10 px-4 inline-flex items-center rounded-md border text-[13.5px] font-medium ${
            onlyOpen ? 'bg-white border-stone-200 text-stone-700' : 'bg-stone-800 border-stone-800 text-white'
          }`}
        >
          Alle ({all.length})
        </Link>
        <Link
          href="/admin/beitraege?offen=1"
          className={`h-10 px-4 inline-flex items-center rounded-md border text-[13.5px] font-medium ${
            onlyOpen ? 'bg-stone-800 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-700'
          }`}
        >
          Nur offene ({openMembers.length})
        </Link>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-[minmax(200px,1fr)_120px_120px_130px_110px] gap-3 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 bg-paper-50 border-b border-stone-200">
          <span>Mitglied</span>
          <span>Kategorie</span>
          <span>Offen</span>
          <span>Status</span>
          <span>Zuletzt gemahnt</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.id}
            className={[
              'grid grid-cols-[minmax(200px,1fr)_120px_120px_130px_110px] gap-3 px-5 py-3 items-center',
              i % 2 ? '' : 'bg-paper-50/40',
              'border-b border-stone-100 last:border-b-0',
            ].join(' ')}
          >
            <Link href={`/admin/mitglieder/${r.id}`} className="flex items-center gap-3 min-w-0 group">
              <Avatar initials={r.initials} size={32} tone={r.avatarTone as AvatarTone} />
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-stone-800 leading-tight truncate group-hover:text-lake-700">
                  {r.name}
                </div>
                <div className="font-mono text-[10.5px] text-stone-500 truncate">{r.email ?? 'keine E-Mail'}</div>
              </div>
            </Link>
            <span className="text-[12.5px] text-stone-700">{memberCategoryLabel(r.category)}</span>
            <span className="font-display text-[15px] text-stone-800">
              {r.paymentDueCents > 0 ? eur(r.paymentDueCents) : '—'}
            </span>
            <Badge tone={STATUS_TONE[r.paymentStatus]}>{STATUS_LABEL[r.paymentStatus]}</Badge>
            <span className="font-mono text-[11.5px] text-stone-500 uppercase tracking-[0.1em]">
              {r.paymentRemindedAt
                ? r.paymentRemindedAt.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: '2-digit' })
                : '—'}
            </span>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[14px] text-stone-500">
            {onlyOpen ? 'Keine offenen Beiträge.' : 'Noch keine Mitglieder erfasst.'}
          </div>
        )}
      </div>
    </main>
  );
}
