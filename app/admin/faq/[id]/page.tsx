import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { FaqForm } from '@/components/admin/FaqForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getFaq } from '@/lib/db/queries/faqs';
import { deleteFaq, updateFaq } from '@/lib/actions/faqs';

export const dynamic = 'force-dynamic';

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await getFaq(id);
  if (!faq) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/faq"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Frage bearbeiten</h1>
      </div>

      <FaqForm action={updateFaq} faq={faq} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Diese Frage wird dauerhaft entfernt und verschwindet von der Startseite.
        </p>
        <DeleteButton
          action={deleteFaq}
          id={faq.id}
          label="Frage löschen"
          confirmText={`„${faq.question}" wirklich löschen?`}
        />
      </div>
    </main>
  );
}
