import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import type { Contact } from '@/lib/db/schema';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

export function ContactForm({
  action,
  contact,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  contact?: Contact;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5" encType="multipart/form-data">
      {contact && <input type="hidden" name="id" value={contact.id} />}
      {contact?.photoUrl && <input type="hidden" name="currentPhotoUrl" value={contact.photoUrl} />}

      <TextField
        label="Name"
        name="name"
        required
        defaultValue={contact?.name ?? ''}
        placeholder="z. B. Michael Pirker"
      />

      <TextField
        label="Funktion (optional)"
        name="role"
        defaultValue={contact?.role ?? ''}
        placeholder="z. B. Cheftrainer, Jugendtrainer, Obmann"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Telefon (optional)" name="phone" type="tel" defaultValue={contact?.phone ?? ''} placeholder="+43 …" />
        <TextField label="E-Mail (optional)" name="email" type="email" defaultValue={contact?.email ?? ''} placeholder="name@tsv-treffen.at" />
      </div>

      <div>
        <span className={fieldLabel}>Foto (optional)</span>
        {contact?.photoUrl && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contact.photoUrl}
              alt={`Foto ${contact.name}`}
              className="h-16 w-16 object-cover rounded-full border border-stone-200"
            />
            <span className="text-[13px] text-stone-500">Aktuelles Foto</span>
          </div>
        )}
        <input
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp"
          className="mt-2 block w-full text-[14px] text-stone-700 file:mr-4 file:h-11 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-paper-50 file:text-[14px] file:font-medium hover:file:bg-stone-700 file:cursor-pointer"
        />
        <p className="mt-1.5 text-[12.5px] text-stone-500">
          PNG, JPG oder WEBP, max. 5 MB.{contact ? ' Leer lassen, um das aktuelle Foto zu behalten.' : ''}
        </p>
      </div>

      <TextField
        label="Reihenfolge (0 = zuerst)"
        name="sortOrder"
        type="number"
        defaultValue={contact ? String(contact.sortOrder) : '0'}
      />

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={contact?.active ?? true}
          className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700">Auf der Startseite anzeigen (aktiv)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          {submitLabel}
        </Button>
        <Link
          href="/admin/kontakte"
          className="inline-flex items-center justify-center h-11 px-5 text-[15px] font-medium rounded-md text-stone-700 hover:bg-stone-100"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
