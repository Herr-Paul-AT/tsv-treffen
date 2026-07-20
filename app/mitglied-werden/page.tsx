import Link from 'next/link';
import { TSVMark } from '@/components/brand/Logo';
import { Icon } from '@/components/ui/Icon';
import { MembershipRequestForm, type PlanOption } from '@/components/MembershipRequestForm';
import { submitMembershipRequest } from '@/lib/actions/membership-requests';
import { listActiveMembershipPlans } from '@/lib/db/queries/membership-plans';

export const dynamic = 'force-dynamic';

export default async function MembershipRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const sp = await searchParams;
  const plansRaw = await listActiveMembershipPlans();
  const plans: PlanOption[] = plansRaw.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
  }));

  return (
    <main className="min-h-dvh bg-paper-100">
      <div className="max-w-xl w-full mx-auto px-6 sm:px-7 pt-10 pb-16">
        <Link href="/" aria-label="Zur Startseite" className="inline-block">
          <TSVMark size={64} variant="color" />
        </Link>

        <Link
          href="/#mitgliedschaft"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-600 hover:text-stone-800"
        >
          <Icon.ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        <div className="mt-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
            Mitglied werden
          </span>
          <h1 className="font-display text-[32px] sm:text-[40px] leading-[1.05] text-stone-800 mt-2">
            Dabei sein.
          </h1>
          <p className="text-[16px] text-stone-600 mt-3 leading-[1.55]">
            Fülle das Formular aus — wir melden uns persönlich bei dir und klären alles Weitere.
            Schnuppern ist jederzeit kostenlos möglich.
          </p>
        </div>

        <MembershipRequestForm
          action={submitMembershipRequest}
          plans={plans}
          initialSlug={sp.plan}
        />
      </div>
    </main>
  );
}
