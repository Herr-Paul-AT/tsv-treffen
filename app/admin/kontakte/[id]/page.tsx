import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/admin/ContactForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getContact } from '@/lib/db/queries/contacts';
import { deleteContact, updateContact } from '@/lib/actions/contacts';

export const dynamic = 'force-dynamic';

export default async function EditContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const contact = await getContact(id);
  if (!contact) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/kontakte"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Kontakt bearbeiten</h1>
      </div>
      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}

      <ContactForm action={updateContact} contact={contact} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Dieser Kontakt wird dauerhaft entfernt und verschwindet von der Startseite.
        </p>
        <DeleteButton
          action={deleteContact}
          id={contact.id}
          label="Kontakt löschen"
          confirmText={`„${contact.name}" wirklich löschen?`}
        />
      </div>
    </main>
  );
}
