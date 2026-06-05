import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { NewsletterComposer } from '@/components/admin/NewsletterComposer';
import { createDraft } from '@/lib/actions/newsletters';
import { listTeamOptions } from '@/lib/db/queries/teams';

export const dynamic = 'force-dynamic';

export default async function NewNewsletterPage() {
  const teamOptions = await listTeamOptions();
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/rundmail"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zu Rundmail
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Kommunikation
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Neue Rundmail</h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Erst als Entwurf speichern — auf der nächsten Seite kannst du Empfänger prüfen und dann
          versenden.
        </p>
      </div>
      <NewsletterComposer action={createDraft} teamOptions={teamOptions} submitLabel="Als Entwurf speichern" />
    </main>
  );
}
