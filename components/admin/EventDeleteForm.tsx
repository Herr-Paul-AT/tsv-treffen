'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Löschen/Absagen einer Veranstaltung — optional mit Absage-Mail an alle
 * Teilnehmer (Online-Anmeldungen + Zu-/Vielleicht-Zusagen).
 */
export function EventDeleteForm({
  action,
  id,
  title,
  participantCount,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  title: string;
  participantCount: number;
}) {
  const [notify, setNotify] = useState(participantCount > 0);
  const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const msg = notify
          ? `„${title}" wirklich absagen und löschen? ${participantCount} Teilnehmer bekommen eine Absage-Mail.`
          : `„${title}" wirklich löschen? Es wird niemand informiert. Das kann nicht rückgängig gemacht werden.`;
        if (!window.confirm(msg)) e.preventDefault();
      }}
      className="space-y-4"
    >
      <input type="hidden" name="id" value={id} />
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          name="notifyParticipants"
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
          className="mt-0.5 w-5 h-5 flex-none rounded border-stone-300 text-lake-700 focus:ring-lake-500/30"
        />
        <span className="text-[15px] text-stone-700 leading-snug">
          Teilnehmer über die Absage per Mail informieren
          <span className="block text-[12.5px] text-stone-500">
            {participantCount > 0
              ? `${participantCount} Empfänger (Online-Anmeldungen und Mitglieder mit Zu-/Vielleicht-Zusage).`
              : 'Aktuell gibt es keine Teilnehmer mit E-Mail-Adresse.'}
          </span>
        </span>
      </label>
      {notify && (
        <label htmlFor="cancel-note" className="block pl-8">
          <span className={fieldLabel}>Hinweis an die Teilnehmer (optional)</span>
          <textarea
            id="cancel-note"
            name="cancelNote"
            rows={2}
            placeholder="z. B. Wegen Schlechtwetter abgesagt — Ersatztermin folgt."
            className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
          />
        </label>
      )}
      <Button type="submit" variant="destructive" icon={<Icon.Trash size={16} />}>
        {notify ? 'Absagen & löschen' : 'Veranstaltung löschen'}
      </Button>
    </form>
  );
}
