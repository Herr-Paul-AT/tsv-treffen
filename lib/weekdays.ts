/** Wochentage: gespeicherter Kurzwert + Sortier-Reihenfolge + Anzeigename. */
export const WEEKDAYS = [
  { value: 'Mo', order: 0, label: 'Montag' },
  { value: 'Di', order: 1, label: 'Dienstag' },
  { value: 'Mi', order: 2, label: 'Mittwoch' },
  { value: 'Do', order: 3, label: 'Donnerstag' },
  { value: 'Fr', order: 4, label: 'Freitag' },
  { value: 'Sa', order: 5, label: 'Samstag' },
  { value: 'So', order: 6, label: 'Sonntag' },
] as const;

export const WEEKDAY_VALUES = WEEKDAYS.map((d) => d.value) as string[];

export function weekdayOrderFor(value: string): number {
  return WEEKDAYS.find((d) => d.value === value)?.order ?? 0;
}
