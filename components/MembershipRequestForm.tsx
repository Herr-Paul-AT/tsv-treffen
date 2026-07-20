'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { MEMBER_CATEGORIES } from '@/lib/member-categories';

export type PlanOption = {
  slug: string;
  name: string;
  category: string | null;
};

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

export function MembershipRequestForm({
  action,
  plans,
  initialSlug,
}: {
  action: (formData: FormData) => void | Promise<void>;
  plans: PlanOption[];
  initialSlug?: string;
}) {
  const firstPlan = plans[0]?.slug ?? '';
  const [slug, setSlug] = useState(
    initialSlug && plans.some((p) => p.slug === initialSlug) ? initialSlug : firstPlan,
  );
  const selectedPlan = useMemo(() => plans.find((p) => p.slug === slug), [plans, slug]);
  const [category, setCategory] = useState<string>(selectedPlan?.category ?? 'vollmitglied');
  const [isSponsor, setIsSponsor] = useState(false);

  function onPlanChange(next: string) {
    setSlug(next);
    const plan = plans.find((p) => p.slug === next);
    if (plan?.category) setCategory(plan.category);
  }

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="planSlug" value={selectedPlan?.slug ?? ''} />
      <input type="hidden" name="planName" value={selectedPlan?.name ?? ''} />

      {plans.length > 0 && (
        <div>
          <label htmlFor="mr-plan" className="block">
            <span className={fieldLabel}>Paket</span>
            <select
              id="mr-plan"
              value={slug}
              onChange={(e) => onPlanChange(e.target.value)}
              className={selectClass}
            >
              {plans.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div>
        <label htmlFor="mr-category" className="block">
          <span className={fieldLabel}>Kategorie</span>
          <select
            id="mr-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            {MEMBER_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Vorname" name="firstName" required placeholder="Vorname" autoComplete="given-name" />
        <TextField label="Nachname" name="lastName" required placeholder="Nachname" autoComplete="family-name" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="E-Mail" name="email" type="email" required placeholder="name@example.at" autoComplete="email" />
        <TextField label="Telefonnummer" name="phone" type="tel" required placeholder="+43 …" autoComplete="tel" />
      </div>

      <TextField label="Adresse (Straße & Nr.)" name="street" required placeholder="Musterstraße 1" autoComplete="street-address" />

      <div className="grid sm:grid-cols-[160px_1fr] gap-4">
        <TextField label="PLZ" name="postalCode" required placeholder="9521" autoComplete="postal-code" />
        <TextField label="Ort" name="city" required placeholder="Treffen am Ossiachersee" autoComplete="address-level2" />
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="isSponsor"
            checked={isSponsor}
            onChange={(e) => setIsSponsor(e.target.checked)}
            className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
          />
          <span className="text-[15px] text-stone-700">Ich möchte den Verein als Sponsor unterstützen</span>
        </label>
        {isSponsor && (
          <div className="mt-4">
            <label htmlFor="mr-sponsor" className="block">
              <span className={fieldLabel}>Was möchten Sie sponsern? (optional)</span>
              <textarea
                id="mr-sponsor"
                name="sponsorNote"
                rows={2}
                placeholder="z. B. Bandenwerbung, Trikots, Sachpreis für ein Turnier …"
                className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
              />
            </label>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="mr-message" className="block">
          <span className={fieldLabel}>Nachricht (optional)</span>
          <textarea
            id="mr-message"
            name="message"
            rows={3}
            placeholder="Anmerkungen, Fragen, gewünschter Trainingsslot zum Schnuppern …"
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" size="lg" iconAfter={<Icon.ArrowRight size={16} />}>
          Anmeldung absenden
        </Button>
        <p className="mt-3 text-[13px] text-stone-500 leading-relaxed">
          Mit dem Absenden übermittelst du deine Angaben an den TSV Schloss Treffen. Wir melden uns
          persönlich bei dir. Es entstehen noch keine Kosten.
        </p>
      </div>
    </form>
  );
}
