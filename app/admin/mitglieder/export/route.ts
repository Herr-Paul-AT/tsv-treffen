import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const ROLE_LABEL: Record<string, string> = {
  member: 'Mitglied',
  trainer: 'Trainer',
  jugendleiter: 'Jugendleiter',
  obmann: 'Obmann',
  admin: 'Admin',
};
const STATUS_LABEL: Record<string, string> = {
  active: 'Aktiv',
  probe: 'Probe',
  paused: 'Pausiert',
  inactive: 'Inaktiv',
};

function csvCell(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const rows = await db
    .select()
    .from(members)
    .orderBy(asc(members.lastName), asc(members.firstName));

  const header = [
    'Vorname',
    'Nachname',
    'E-Mail',
    'Telefon',
    'Adresse',
    'PLZ',
    'Ort',
    'Rolle',
    'Status',
    'Geburtsdatum',
    'LK',
    'Mitglied seit',
    'Beitragsstatus',
    'Offen EUR',
  ];

  const lines = [header.join(',')];
  for (const m of rows) {
    lines.push(
      [
        csvCell(m.firstName),
        csvCell(m.lastName),
        csvCell(m.email),
        csvCell(m.phone),
        csvCell(m.street),
        csvCell(m.postalCode),
        csvCell(m.city),
        csvCell(ROLE_LABEL[m.role] ?? m.role),
        csvCell(STATUS_LABEL[m.status] ?? m.status),
        csvCell(m.birthdate),
        csvCell(m.lkRating),
        csvCell(m.memberSince),
        csvCell(m.paymentStatus),
        csvCell((m.paymentDueCents / 100).toFixed(2)),
      ].join(','),
    );
  }

  const csv = '﻿' + lines.join('\r\n');
  const today = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="mitglieder-${today}.csv"`,
    },
  });
}
