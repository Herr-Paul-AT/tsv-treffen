import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PartnerForm } from '@/components/admin/PartnerForm';
import { createPartner } from '@/lib/actions/partners';

export const dynamic = 'force-dynamic';

export default async function NewPartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/partner"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Neuer Partner</h1>
      </div>
      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}
      <PartnerForm action={createPartner} submitLabel="Anlegen" />
    </main>
  );
}
