import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { MembershipPlanForm } from '@/components/admin/MembershipPlanForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { getMembershipPlan } from '@/lib/db/queries/membership-plans';
import { deleteMembershipPlan, updateMembershipPlan } from '@/lib/actions/membership-plans';

export const dynamic = 'force-dynamic';

export default async function EditMembershipPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getMembershipPlan(id);
  if (!plan) notFound();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <Link
        href="/admin/tarife"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
      >
        <Icon.ArrowLeft size={14} /> Zurück zur Übersicht
      </Link>
      <div className="mt-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Mitgliedschaft
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">
          Paket bearbeiten
        </h1>
      </div>

      <MembershipPlanForm action={updateMembershipPlan} plan={plan} submitLabel="Änderungen speichern" />

      <div className="mt-12 max-w-2xl border-t border-stone-200 pt-6">
        <h2 className="font-display text-[18px] text-stone-800">Gefahrenzone</h2>
        <p className="text-[14px] text-stone-600 mt-1.5 mb-4">
          Dieses Paket wird dauerhaft entfernt und verschwindet von der Startseite.
        </p>
        <DeleteButton
          action={deleteMembershipPlan}
          id={plan.id}
          label="Paket löschen"
          confirmText={`„${plan.name}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`}
        />
      </div>
    </main>
  );
}
