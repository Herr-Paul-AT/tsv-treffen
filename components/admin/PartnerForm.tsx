import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Partner } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function PartnerForm({
  action,
  partner,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  partner?: Partner;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5" encType="multipart/form-data">
      {partner && <input type="hidden" name="id" value={partner.id} />}
      {partner?.logoUrl && <input type="hidden" name="currentLogoUrl" value={partner.logoUrl} />}

      <TextField
        label="Name"
        name="name"
        required
        defaultValue={partner?.name ?? ''}
        placeholder="z. B. Kärntner Tennisverband (KTV)"
      />

      <TextField
        label="Link / Website (optional)"
        name="url"
        defaultValue={partner?.url ?? ''}
        placeholder="z. B. www.ktv.at"
      />

      <div>
        <span className={fieldLabel}>Logo (optional)</span>
        {partner?.logoUrl && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={partner.logoUrl}
              alt={`Logo ${partner.name}`}
              className="h-12 w-auto max-w-[140px] object-contain rounded-md border border-stone-200 bg-white p-2"
            />
            <span className="text-[13px] text-stone-500">Aktuelles Logo</span>
          </div>
        )}
        <input
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          className="mt-2 block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer"
        />
        <p className="mt-1.5 text-[12.5px] text-stone-500">
          Optional. PNG, JPG, WEBP oder SVG, max. 5 MB.{' '}
          {partner ? 'Leer lassen, um das aktuelle Logo zu behalten.' : ''}
        </p>
      </div>

      <TextField
        label="Reihenfolge (0 = zuerst)"
        name="sortOrder"
        type="number"
        defaultValue={partner ? String(partner.sortOrder) : '0'}
      />

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={partner?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/partner"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
