const MONTHS_DE = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const WEEKDAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const WEEKDAYS_DE_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function formatGermanDate(d: Date): string {
  return `${WEEKDAYS_DE[d.getDay()]} · ${d.getDate()}. ${MONTHS_DE[d.getMonth()]}`;
}

export function formatDayMonth(d: Date): string {
  return `${d.getDate()}. ${MONTHS_DE[d.getMonth()]}`;
}

export function formatDayMonthCaps(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}. ${MONTHS_DE[d.getMonth()].toUpperCase()}`;
}

export function formatTimeRange(start: Date, end: Date): string {
  const hm = (x: Date) => `${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`;
  return `${hm(start)}–${hm(end)}`;
}

export function formatRelativeFromNow(target: Date): string {
  const ms = target.getTime() - Date.now();
  const mins = Math.round(ms / 60_000);
  if (mins < 0) {
    const past = Math.abs(mins);
    if (past < 60) return `vor ${past} Min`;
    if (past < 60 * 24) return `vor ${Math.round(past / 60)} h`;
    return `vor ${Math.round(past / (60 * 24))} Tagen`;
  }
  if (mins < 60) return `in ${mins} Min`;
  if (mins < 60 * 24) return `in ${Math.round(mins / 60)} h`;
  if (mins < 60 * 24 * 7) return `in ${Math.round(mins / (60 * 24))} Tagen`;
  return formatDayMonth(target);
}

export function isToday(d: Date): boolean {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function isTomorrow(d: Date): boolean {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

export function shortDateLabel(d: Date): string {
  if (isToday(d)) return 'heute';
  if (isTomorrow(d)) return 'morgen';
  return `${WEEKDAYS_DE_SHORT[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
}

export { MONTHS_DE, WEEKDAYS_DE, WEEKDAYS_DE_SHORT };
