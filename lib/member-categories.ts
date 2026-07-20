/** Mitglieds-Kategorien mit Anzeigenamen (eine Quelle für Formulare + Admin). */
export const MEMBER_CATEGORIES = [
  { value: 'kinder', label: 'Kinder' },
  { value: 'jugend', label: 'Jugend' },
  { value: 'vollmitglied', label: 'Vollmitglied' },
  { value: 'std_abo', label: 'Stundenabo' },
  { value: 'unterstuetzend', label: 'Unterstützendes Mitglied' },
] as const;

export type MemberCategoryValue = (typeof MEMBER_CATEGORIES)[number]['value'];

export const MEMBER_CATEGORY_VALUES = MEMBER_CATEGORIES.map((c) => c.value) as MemberCategoryValue[];

export function memberCategoryLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return MEMBER_CATEGORIES.find((c) => c.value === value)?.label ?? String(value);
}
