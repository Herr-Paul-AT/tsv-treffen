import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Sponsor } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function SponsorForm({
  action,
  sponsor,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sponsor?: Sponsor;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5" encType="multipart/form-data">
      {sponsor && <input type="hidden" name="id" value={sponsor.id} />}
      {sponsor?.logoUrl && <input type="hidden" name="currentLogoUrl" value={sponsor.logoUrl} />}

      <TextField
        label="Name des Sponsors"
        name="name"
        required
        defaultValue={sponsor?.name ?? ''}
        placeholder="z. B. Hirter Bier"
      />

      <TextField
        label="Website / Link (optional)"
        name="website"
        defaultValue={sponsor?.website ?? ''}
        placeholder="z. B. www.hirterbier.at"
      />

      <div>
        <span className={fieldLabel}>Logo</span>
        {sponsor?.logoUrl && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sponsor.logoUrl}
              alt={`Logo ${sponsor.name}`}
              className="h-14 w-auto max-w-[160px] object-contain rounded-md border border-stone-200 bg-white p-2"
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
          PNG, JPG, WEBP oder SVG, max. 5 MB.{' '}
          {sponsor ? 'Leer lassen, um das aktuelle Logo zu behalten.' : ''}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          label="Reihenfolge (0 = zuerst)"
          name="sortOrder"
          type="number"
          defaultValue={sponsor ? String(sponsor.sortOrder) : '0'}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={sponsor?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/sponsoren"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
