import Link from 'next/link';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listNewsletters } from '@/lib/db/queries/newsletters';
import { isMailConfigured, MAIL_FROM } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, BadgeTone> = {
  draft: 'neutral',
  queued: 'sand',
  sent: 'forest',
  failed: 'danger',
};
const STATUS_LABEL: Record<string, string> = {
  draft: 'Entwurf',
  queued: 'Wartet',
  sent: 'Gesendet',
  failed: 'Fehler',
};
const AUDIENCE_LABEL: Record<string, string> = {
  all: 'Alle Mitglieder',
  active: 'Aktive Mitglieder',
  probe: 'Probemitglieder',
  team: 'Mannschaft',
  custom: 'Auswahl',
};

export default async function AdminNewslettersPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; failed?: string }>;
}) {
  const [items, sp] = await Promise.all([listNewsletters(), searchParams]);
  const sentCount = sp.sent ? Number(sp.sent) : null;
  const mailConfigured = isMailConfigured();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Kommunikation
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Rundmail</h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-xl">
            Newsletter an Mitglieder, Mannschaften oder die ganze Vereinsgemeinde.
          </p>
        </div>
        <Link href="/admin/rundmail/neu">
          <Button variant="primary" icon={<Icon.Plus size={16} />}>
            Neue Rundmail
          </Button>
        </Link>
      </div>

      {sentCount !== null && (
        <div className="mt-5 flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-lg px-5 py-3.5">
          <Icon.Check size={18} className="text-forest-700" />
          <span className="text-[14px] text-forest-800">
            Rundmail versendet — <strong>{sentCount}</strong> Empfänger:innen
            {Number(sp.failed) > 0 ? ` · ${sp.failed} fehlgeschlagen` : ''}.
          </span>
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <section>
          <h2 className="font-display text-[22px] text-stone-800 mb-3">Verlauf</h2>
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-lg px-5 py-8 text-center text-[14px] text-stone-500">
                Noch keine Rundmails. Leg deine erste über „Neue Rundmail" an.
              </div>
            )}
            {items.map((n) => (
              <Link
                key={n.id}
                href={`/admin/rundmail/${n.id}`}
                className="block bg-white border border-stone-200 rounded-lg p-5 transition-all hover:border-stone-300 hover:shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={STATUS_TONE[n.status]}>{STATUS_LABEL[n.status]}</Badge>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                        {AUDIENCE_LABEL[n.audience]} · {n.recipientCount} Empfänger:innen
                      </span>
                    </div>
                    <h3 className="font-display text-[20px] text-stone-800 leading-tight mt-2">
                      {n.subject}
                    </h3>
                    <p className="text-[13.5px] text-stone-600 mt-2 leading-[1.55] line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                  <div className="text-right flex-none">
                    {n.sentAt && (
                      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                        {n.sentAt.toLocaleDateString('de-AT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {n.authorName && (
                      <div className="text-[12.5px] text-stone-700 mt-1">{n.authorName}</div>
                    )}
                    <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-lake-700">
                      {n.status === 'draft' ? 'Bearbeiten & senden' : 'Ansehen'}{' '}
                      <Icon.ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h3 className="font-display text-[18px] text-stone-800">Versand-Status</h3>
            <div className="mt-3 flex items-center gap-2.5">
              <span
                className={[
                  'w-2.5 h-2.5 rounded-full',
                  mailConfigured ? 'bg-forest-500' : 'bg-sand-500',
                ].join(' ')}
              />
              <span className="text-[14px] font-medium text-stone-800">
                {mailConfigured ? 'SMTP aktiv' : 'SMTP nicht konfiguriert'}
              </span>
            </div>
            {mailConfigured ? (
              <p className="text-[12.5px] text-stone-600 mt-2 leading-snug">
                Versand über <span className="font-mono">{MAIL_FROM}</span>. Eine Kopie jeder
                Rundmail liegt per BCC in eurem Postfach.
              </p>
            ) : (
              <p className="text-[12.5px] text-stone-600 mt-2 leading-snug">
                Noch ohne Mailserver: Du kannst Entwürfe anlegen und über dein eigenes
                E-Mail-Programm versenden (BCC). Für automatischen Versand SMTP hinterlegen — z. B.
                World4You (<span className="font-mono">smtp.world4you.com:587</span>).
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
