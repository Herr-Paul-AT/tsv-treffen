'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Icon } from '@/components/ui/Icon';
import { MEMBER_CATEGORIES } from '@/lib/member-categories';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';
const selectClass =
  'w-full h-12 px-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15';

let nextId = 2;

export function FamilyForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  // Startet mit zwei Personen (z. B. Elternteil + Kind).
  const [rows, setRows] = useState<number[]>([0, 1]);

  return (
    <form action={action} className="mt-8 max-w-3xl space-y-6">
      {/* Personen */}
      <div className="space-y-3">
        <div className={fieldLabel}>Familienmitglieder</div>
        {rows.map((rid, idx) => (
          <div
            key={rid}
            className="rounded-lg border border-stone-200 bg-white p-4 grid sm:grid-cols-[1fr_1fr_150px_150px_40px] gap-3 items-end"
          >
            <label className="block">
              <span className={fieldLabel}>Vorname</span>
              <input name="firstName" required className={`mt-2 ${selectClass}`} placeholder="Vorname" />
            </label>
            <label className="block">
              <span className={fieldLabel}>Nachname</span>
              <input name="lastName" required className={`mt-2 ${selectClass}`} placeholder="Nachname" />
            </label>
            <label className="block">
              <span className={fieldLabel}>Kategorie</span>
              <select name="category" defaultValue="" className={`mt-2 ${selectClass}`}>
                <option value="">— keine —</option>
                {MEMBER_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={fieldLabel}>Geburtsdatum</span>
              <input name="birthdate" type="date" className={`mt-2 ${selectClass}`} />
            </label>
            <button
              type="button"
              aria-label="Person entfernen"
              onClick={() => setRows((r) => (r.length > 1 ? r.filter((x) => x !== rid) : r))}
              className="h-12 w-10 inline-flex items-center justify-center rounded-md border border-stone-200 text-stone-500 hover:text-danger hover:border-danger/40 disabled:opacity-40"
              disabled={rows.length <= 1 && idx === 0}
            >
              <Icon.Trash size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows((r) => [...r, nextId++])}
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-md border border-stone-200 bg-white text-[14px] font-medium text-stone-700 hover:bg-stone-50"
        >
          <Icon.Plus size={16} /> Weitere Person
        </button>
      </div>

      {/* Gemeinsame Kontaktdaten */}
      <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-4">
        <div className={fieldLabel}>Gemeinsame Kontaktdaten</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Kontakt-E-Mail" name="email" type="email" placeholder="familie@example.at" />
          <TextField label="Telefon" name="phone" required placeholder="+43 …" />
        </div>
        <TextField label="Adresse" name="street" placeholder="Straße und Hausnummer" />
        <div className="grid sm:grid-cols-[160px_1fr] gap-4">
          <TextField label="PLZ" name="postalCode" placeholder="9521" />
          <TextField label="Ort" name="city" placeholder="Treffen" />
        </div>
      </div>

      {/* Einwilligungen (gelten für alle Personen) */}
      <div className="rounded-lg border border-stone-200 bg-white p-4 space-y-3">
        <div className={fieldLabel}>Einwilligungen (für alle Personen)</div>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" name="privacyConsent" className="mt-0.5 w-5 h-5 flex-none rounded border-stone-300 text-lake-700 focus:ring-lake-500/30" />
          <span className="text-[15px] text-stone-700 leading-snug">Datenschutz-Zustimmung liegt vor</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" name="photoConsent" className="mt-0.5 w-5 h-5 flex-none rounded border-stone-300 text-lake-700 focus:ring-lake-500/30" />
          <span className="text-[15px] text-stone-700 leading-snug">Einverstanden mit Veröffentlichung von Fotos (Verein / Aushang)</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer select-none pl-8">
          <input type="checkbox" name="photoConsentHomepage" className="mt-0.5 w-5 h-5 flex-none rounded border-stone-300 text-lake-700 focus:ring-lake-500/30" />
          <span className="text-[14px] text-stone-600 leading-snug">… zusätzlich auch auf der öffentlichen Homepage</span>
        </label>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" name="sendWelcome" defaultChecked className="w-5 h-5 rounded border-stone-300 text-lake-700 focus:ring-lake-500/30" />
        <span className="text-[15px] text-stone-700">Willkommens-E-Mail an die Kontaktadresse senden (sofern E-Mail angegeben)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          Familie anlegen
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
