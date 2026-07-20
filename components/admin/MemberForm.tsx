import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Member } from '@/lib/db/schema';
import { MEMBER_CATEGORIES } from '@/lib/member-categories';

const CATEGORY_OPTIONS = [{ value: '', label: '— keine —' }, ...MEMBER_CATEGORIES];

const ROLE_OPTIONS = [
  { value: 'member', label: 'Mitglied' },
  { value: 'trainer', label: 'Trainer' },
  { value: 'jugendleiter', label: 'Jugendleiter' },
  { value: 'obmann', label: 'Obmann / Vorstand' },
  { value: 'admin', label: 'Administrator' },
];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Aktiv' },
  { value: 'probe', label: 'Probemitglied' },
  { value: 'paused', label: 'Pausiert' },
  { value: 'inactive', label: 'Inaktiv' },
];
const PAYMENT_OPTIONS = [
  { value: 'paid', label: 'Bezahlt' },
  { value: 'open', label: 'Offen' },
  { value: 'partial', label: 'Anteilig' },
  { value: 'waived', label: 'Erlassen' },
];

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

function NativeSelect({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <label htmlFor={`f-${name}`} className="block">
      <span className={fieldLabel}>{label}</span>
      <select id={`f-${name}`} name={name} defaultValue={defaultValue} className={selectClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function isoDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function MemberForm({
  action,
  member,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  member?: Member;
  submitLabel: string;
}) {
  const dueEuros =
    member && member.paymentDueCents > 0 ? String(member.paymentDueCents / 100) : '';

  return (
    <form action={action} className="mt-8 max-w-3xl space-y-5">
      {member && <input type="hidden" name="id" value={member.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Vorname" name="firstName" required defaultValue={member?.firstName ?? ''} />
        <TextField label="Nachname" name="lastName" required defaultValue={member?.lastName ?? ''} />
      </div>

      <TextField
        label="E-Mail (optional)"
        name="email"
        type="email"
        defaultValue={member?.email ?? ''}
        placeholder="vorname.name@example.at"
      />

      <TextField label="Adresse (optional)" name="street" defaultValue={member?.street ?? ''} placeholder="Straße und Hausnummer" />
      <div className="grid sm:grid-cols-[160px_1fr] gap-4">
        <TextField label="PLZ (optional)" name="postalCode" defaultValue={member?.postalCode ?? ''} placeholder="9521" />
        <TextField label="Ort (optional)" name="city" defaultValue={member?.city ?? ''} placeholder="Treffen" />
      </div>

      <NativeSelect
        name="category"
        label="Mitglieds-Kategorie"
        options={CATEGORY_OPTIONS}
        defaultValue={member?.category ?? ''}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <NativeSelect name="role" label="Rolle" options={ROLE_OPTIONS} defaultValue={member?.role ?? 'member'} />
        <NativeSelect
          name="status"
          label="Status"
          options={STATUS_OPTIONS}
          defaultValue={member?.status ?? 'active'}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Telefon (optional)" name="phone" defaultValue={member?.phone ?? ''} />
        <TextField
          label="Geburtsdatum (optional)"
          name="birthdate"
          type="date"
          defaultValue={isoDate(member?.birthdate)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="LK-Rating (optional)"
          name="lkRating"
          defaultValue={member?.lkRating ?? ''}
          placeholder="z. B. 12.5"
        />
        <TextField
          label="Mitglied seit (optional)"
          name="memberSince"
          type="date"
          defaultValue={isoDate(member?.memberSince)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <NativeSelect
          name="paymentStatus"
          label="Beitragsstatus"
          options={PAYMENT_OPTIONS}
          defaultValue={member?.paymentStatus ?? 'paid'}
        />
        <TextField
          label="Offener Beitrag in € (optional)"
          name="paymentDueEuros"
          defaultValue={dueEuros}
          placeholder="z. B. 120"
        />
      </div>

      <div>
        <label htmlFor="f-notes" className="block">
          <span className={fieldLabel}>Notiz (optional)</span>
          <textarea
            id="f-notes"
            name="notes"
            rows={3}
            defaultValue={member?.notes ?? ''}
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="isSponsor"
            defaultChecked={member?.isSponsor ?? false}
            className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
          />
          <span className="text-[15px] text-stone-700">Ist Sponsor des Vereins</span>
        </label>
        <label htmlFor="f-sponsorNote" className="block">
          <span className={fieldLabel}>Was wird gesponsert? (optional)</span>
          <input
            id="f-sponsorNote"
            name="sponsorNote"
            defaultValue={member?.sponsorNote ?? ''}
            placeholder="z. B. Bandenwerbung, Trikots …"
            className="mt-2 w-full h-12 px-4 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15"
          />
        </label>
      </div>

      {!member && (
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="sendWelcome"
            defaultChecked
            className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
          />
          <span className="text-[15px] text-stone-700">
            Willkommens-E-Mail an das Mitglied senden (sofern E-Mail angegeben)
          </span>
        </label>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/mitglieder"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
