import type { BadgeTone } from '@/components/ui/Badge';
import type { Event } from '@/lib/db/schema';

export type EventKind = Event['kind'];

/** Alle Arten in Formular-Reihenfolge. 'camp' nur noch für Bestandsdaten. */
export const EVENT_KINDS: { value: EventKind; label: string; tone: BadgeTone }[] = [
  { value: 'training', label: 'Training', tone: 'neutral' },
  { value: 'kindertraining', label: 'Kindertraining', tone: 'forest' },
  { value: 'sommercamp', label: 'Sommercamp', tone: 'sand' },
  { value: 'trainingslager', label: 'Trainingslager', tone: 'lake' },
  { value: 'tournament', label: 'Turnier', tone: 'sand' },
  { value: 'event', label: 'Veranstaltung / Treffen', tone: 'forest' },
  { value: 'match', label: 'Match / Wettkampf', tone: 'lake' },
  { value: 'camp', label: 'Camp (sonstiges)', tone: 'lake' },
];

/** Kurzlabels für Badges in Listen. */
const SHORT: Record<EventKind, string> = {
  training: 'Training',
  kindertraining: 'Kindertraining',
  sommercamp: 'Sommercamp',
  trainingslager: 'Trainingslager',
  tournament: 'Turnier',
  event: 'Veranstaltung',
  match: 'Match',
  camp: 'Camp',
};

export function eventKindLabel(kind: EventKind): string {
  return SHORT[kind] ?? 'Veranstaltung';
}

export function eventKindTone(kind: EventKind): BadgeTone {
  return EVENT_KINDS.find((k) => k.value === kind)?.tone ?? 'neutral';
}

export const EVENT_KIND_VALUES = EVENT_KINDS.map((k) => k.value);

/** Arten, die als buchbares Angebot (mit Online-Anmeldung) erscheinen. */
export const OFFER_KINDS: EventKind[] = ['training', 'kindertraining', 'sommercamp', 'trainingslager', 'camp'];
