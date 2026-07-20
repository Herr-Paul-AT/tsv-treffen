import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { MembershipPlan } from '@/lib/db/schema';
import { MEMBER_CATEGORIES } from '@/lib/member-categories';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function MembershipPlanForm({
  action,
  plan,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  plan?: MembershipPlan;
  submitLabel: string;
}) {
  const priceEuros = plan ? (plan.priceCents / 100).toString() : '';

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      {plan && <input type="hidden" name="id" value={plan.id} />}

      <TextField
        label="Name"
        name="name"
        required
        defaultValue={plan?.name ?? ''}
        placeholder="z. B. Aktiv"
      />

      <TextField
        label="Kurztext / Zielgruppe (optional)"
        name="eyebrow"
        defaultValue={plan?.eyebrow ?? ''}
        placeholder="z. B. Erwachsene · 19–69"
      />

      <div>
        <label htmlFor="plan-category" className="block">
          <span className={fieldLabel}>Mitglieds-Kategorie (für die Anmeldung vorausgewählt)</span>
          <select
            id="plan-category"
            name="category"
            defaultValue={plan?.category ?? ''}
            className="mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
          >
            <option value="">— keine —</option>
            {MEMBER_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Preis in Euro"
          name="price"
          inputMode="decimal"
          defaultValue={priceEuros}
          placeholder="z. B. 280"
        />
        <TextField
          label="Zeitraum"
          name="period"
          defaultValue={plan?.period ?? 'Saison'}
          placeholder="z. B. Saison"
        />
      </div>

      <div>
        <label htmlFor="plan-perks" className="block">
          <span className={fieldLabel}>Leistungen — eine pro Zeile</span>
          <textarea
            id="plan-perks"
            name="perks"
            rows={6}
            defaultValue={plan?.perks ?? ''}
            placeholder={'Mitgliedsbeitrag pro Saison\nFreies Spielen auf allen Plätzen\nVereinsmeisterschaft inklusive'}
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
        <p className="mt-1.5 text-[12.5px] text-stone-500">
          Jede Zeile wird als eigener Haken-Punkt auf der Startseite angezeigt.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Reihenfolge (0 = zuerst)"
          name="sortOrder"
          type="number"
          defaultValue={plan ? String(plan.sortOrder) : '0'}
        />
        <TextField
          label="Slug (für Anmeldung)"
          name="slug"
          defaultValue={plan?.slug ?? ''}
          placeholder="wird aus dem Namen erzeugt"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={plan?.featured ?? false}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">
          Als „Beliebteste" hervorheben (dunkle Karte mit Badge)
        </span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={plan?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/tarife"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
