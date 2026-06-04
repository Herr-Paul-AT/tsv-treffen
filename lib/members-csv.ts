/**
 * Reiner CSV-Parser für den Mitglieder-Import. Wird sowohl im Client (Vorschau)
 * als auch in der Server-Action (maßgeblicher Import) verwendet — daher KEIN
 * 'use client' / 'use server'. Keine DB-, keine React-Abhängigkeiten.
 */

export type MemberRole = 'member' | 'trainer' | 'jugendleiter' | 'obmann' | 'admin';
export type MemberStatus = 'active' | 'probe' | 'paused' | 'inactive';

export type ParsedMember = {
  line: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  role: MemberRole;
  status: MemberStatus;
  birthdate: string | null; // ISO yyyy-mm-dd
  lkRating: string | null;
  valid: boolean;
  issues: string[];
};

export type ParseResult = {
  rows: ParsedMember[];
  validCount: number;
  errorCount: number;
};

const ROLE_ALIASES: Record<string, MemberRole> = {
  member: 'member',
  mitglied: 'member',
  trainer: 'trainer',
  coach: 'trainer',
  jugendleiter: 'jugendleiter',
  obmann: 'obmann',
  vorstand: 'obmann',
  admin: 'admin',
  administrator: 'admin',
};

const STATUS_ALIASES: Record<string, MemberStatus> = {
  active: 'active',
  aktiv: 'active',
  probe: 'probe',
  probemitglied: 'probe',
  paused: 'paused',
  pausiert: 'paused',
  inactive: 'inactive',
  inaktiv: 'inactive',
};

const HEADER_MAP: Record<string, keyof ParsedMember> = {
  vorname: 'firstName',
  firstname: 'firstName',
  first_name: 'firstName',
  nachname: 'lastName',
  lastname: 'lastName',
  last_name: 'lastName',
  name: 'lastName',
  email: 'email',
  'e-mail': 'email',
  mail: 'email',
  telefon: 'phone',
  phone: 'phone',
  tel: 'phone',
  handy: 'phone',
  adresse: 'street',
  adresse1: 'street',
  strasse: 'street',
  straße: 'street',
  street: 'street',
  plz: 'postalCode',
  postleitzahl: 'postalCode',
  postalcode: 'postalCode',
  zip: 'postalCode',
  ort: 'city',
  stadt: 'city',
  city: 'city',
  rolle: 'role',
  role: 'role',
  funktion: 'role',
  status: 'status',
  geburtsdatum: 'birthdate',
  birthdate: 'birthdate',
  geburtstag: 'birthdate',
  lk: 'lkRating',
  lkrating: 'lkRating',
  rating: 'lkRating',
};

const KNOWN_HEADERS = new Set(Object.keys(HEADER_MAP));

/** Positionale Reihenfolge, falls KEINE Kopfzeile erkannt wird. */
const POSITIONAL: (keyof ParsedMember)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'street',
  'postalCode',
  'city',
  'role',
  'status',
  'birthdate',
  'lkRating',
];

function detectDelimiter(line: string): string {
  const counts: [string, number][] = [
    [';', (line.match(/;/g) ?? []).length],
    ['\t', (line.match(/\t/g) ?? []).length],
    [',', (line.match(/,/g) ?? []).length],
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

function splitLine(line: string, delim: string): string[] {
  // Einfacher Splitter mit Unterstützung für "quoted" Felder.
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delim && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function normalizeBirthdate(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  // dd.mm.yyyy
  const de = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (de) {
    const [, d, m, y] = de;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  // yyyy-mm-dd
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Bereinigt mehrzeilige / mehrfach eingetragene Mail-Felder: erste gültige Adresse, kleingeschrieben. */
function cleanEmail(raw: string): string {
  const candidates = raw
    .split(/[\s,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const firstValid = candidates.find((c) => EMAIL_RE.test(c));
  return firstValid ?? (candidates[0] ?? '');
}

export function parseMembersCsv(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { rows: [], validCount: 0, errorCount: 0 };

  const delim = detectDelimiter(lines[0]);
  const firstCells = splitLine(lines[0], delim).map((c) => c.toLowerCase());
  const hasHeader = firstCells.some((c) => KNOWN_HEADERS.has(c));

  let columns: (keyof ParsedMember | null)[];
  let dataStart: number;
  if (hasHeader) {
    columns = firstCells.map((c) => HEADER_MAP[c] ?? null);
    dataStart = 1;
  } else {
    columns = POSITIONAL;
    dataStart = 0;
  }

  const rows: ParsedMember[] = [];
  for (let i = dataStart; i < lines.length; i++) {
    const cells = splitLine(lines[i], delim);
    const rec: Record<string, string> = {};
    columns.forEach((key, idx) => {
      if (key) rec[key] = (cells[idx] ?? '').trim();
    });

    const issues: string[] = [];
    const firstName = rec.firstName ?? '';
    const lastName = rec.lastName ?? '';
    // Mehrfach eingetragene / mehrzeilige Mail-Felder bereinigen: erste gültige Adresse nehmen.
    const email = cleanEmail(rec.email ?? '');

    if (!firstName) issues.push('Vorname fehlt');
    if (!lastName) issues.push('Nachname fehlt');
    // E-Mail ist optional; nur prüfen, wenn etwas dasteht.
    if (email && !EMAIL_RE.test(email)) issues.push('E-Mail ungültig');

    const role = ROLE_ALIASES[(rec.role ?? '').toLowerCase()] ?? 'member';
    const status = STATUS_ALIASES[(rec.status ?? '').toLowerCase()] ?? 'active';
    const birthdate = rec.birthdate ? normalizeBirthdate(rec.birthdate) : null;
    if (rec.birthdate && !birthdate) issues.push('Geburtsdatum unklar');
    const lkRating = rec.lkRating && /^\d+(\.\d+)?$/.test(rec.lkRating) ? rec.lkRating : null;

    rows.push({
      line: i + 1,
      firstName,
      lastName,
      email: email || null,
      phone: rec.phone ? rec.phone : null,
      street: rec.street ? rec.street : null,
      postalCode: rec.postalCode ? rec.postalCode : null,
      city: rec.city ? rec.city : null,
      role,
      status,
      birthdate,
      lkRating,
      valid: issues.length === 0,
      issues,
    });
  }

  const validCount = rows.filter((r) => r.valid).length;
  return { rows, validCount, errorCount: rows.length - validCount };
}

export function initialsFor(firstName: string, lastName: string): string {
  const a = firstName.trim()[0] ?? '';
  const b = lastName.trim()[0] ?? '';
  return (a + b).toUpperCase() || '??';
}

const TONES = ['lake', 'sand', 'forest', 'stone'] as const;
export function toneFor(seed: string): (typeof TONES)[number] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}
