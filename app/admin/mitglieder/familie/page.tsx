import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FamilyForm } from '@/components/admin/FamilyForm';
import { createFamily } from '@/lib/actions/members';

export const dynamic = 'force-dynamic';

export default async function NewFamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/mitglieder"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Mitglieder
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Familie anlegen
        </h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Mehrere Personen mit gemeinsamer Adresse und Kontaktdaten in einem Zug erfassen — je
          Person eine Kategorie (z. B. Kinder, Jugend, Vollmitglied).
        </p>
      </div>

      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}

      <FamilyForm action={createFamily} />
    </main>
  );
}
