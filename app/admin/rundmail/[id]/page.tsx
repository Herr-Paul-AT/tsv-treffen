import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { NewsletterComposer } from '@/components/admin/NewsletterComposer';
import { MailtoButton } from '@/components/admin/MailtoButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import {
  audienceSpecFromNewsletter,
  getNewsletter,
  listMailMemberOptions,
  resolveRecipients,
} from '@/lib/db/queries/newsletters';
import { listTeamOptions } from '@/lib/db/queries/teams';
import { deleteNewsletter, sendNewsletter, updateDraft } from '@/lib/actions/newsletters';
import { isMailConfigured } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export default async function NewsletterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nl = await getNewsletter(id);
  if (!nl) notFound();

  const [teamOptions, memberOptions, recipients] = await Promise.all([
    listTeamOptions(),
    listMailMemberOptions(),
    resolveRecipients(audienceSpecFromNewsletter(nl)),
  ]);
  const mailConfigured = isMailConfigured();
  const isSent = nl.status === 'sent';

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/rundmail"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zu Rundmail
      </Link>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Rundmail
          </div>
          <h1 className="font-display text-[32px] leading-[1.05] text-stone-800 mt-0.5">
            {nl.subject}
          </h1>
        </div>
        <Badge tone={isSent ? 'forest' : 'neutral'}>{isSent ? 'Gesendet' : 'Entwurf'}</Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {isSent ? (
          <div className="mt-6 max-w-2xl bg-white rounded-lg border border-stone-200 p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">
              Versendeter Inhalt
            </div>
            <p className="mt-3 text-[15px] text-stone-700 whitespace-pre-wrap leading-[1.6]">{nl.body}</p>
          </div>
        ) : (
          <NewsletterComposer
            action={updateDraft}
            newsletter={nl}
            teamOptions={teamOptions}
            memberOptions={memberOptions}
            submitLabel="Entwurf aktualisieren"
          />
        )}

        <aside className="mt-6 space-y-4">
          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h2 className="font-display text-[18px] text-stone-800">Empfänger</h2>
            <div className="mt-2 font-display text-[32px] text-stone-800 leading-none">
              {recipients.length}
            </div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-stone-500 mt-1">
              mit E-Mail-Adresse
            </div>
            {recipients.length > 0 && (
              <p className="mt-3 text-[12.5px] text-stone-500 leading-snug">
                {recipients.slice(0, 4).map((r) => r.name).join(', ')}
                {recipients.length > 4 ? ` und ${recipients.length - 4} weitere` : ''}
              </p>
            )}
          </div>

          {!isSent && (
            <div className="bg-stone-800 text-paper-50 rounded-lg p-5 space-y-3">
              <h2 className="font-display text-[18px]">Versenden</h2>
              {mailConfigured ? (
                <form action={sendNewsletter}>
                  <input type="hidden" name="id" value={nl.id} />
                  <Button
                    type="submit"
                    variant="accent"
                    icon={<Icon.Mail size={16} />}
                    className="w-full"
                    disabled={recipients.length === 0}
                  >
                    Jetzt über World4You senden
                  </Button>
                </form>
              ) : (
                <p className="text-[12.5px] text-paper-100/70 leading-snug">
                  SMTP ist noch nicht hinterlegt. Du kannst die Mail unten über dein eigenes
                  E-Mail-Programm verschicken (alle Empfänger im BCC).
                </p>
              )}
              <MailtoButton
                recipients={recipients.map((r) => r.email)}
                subject={nl.subject}
                body={nl.body}
              />
            </div>
          )}
        </aside>
      </div>

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Die Rundmail wird aus der Historie entfernt.
        </p>
        <DeleteButton
          action={deleteNewsletter}
          id={nl.id}
          label="Rundmail löschen"
          confirmText={`„${nl.subject}" wirklich löschen?`}
        />
      </div>
    </main>
  );
}
