import { getEvent, listEventRegistrations } from '@/lib/db/queries/events';

export const dynamic = 'force-dynamic';

function csvCell(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return new Response('Not found', { status: 404 });

  const rows = await listEventRegistrations(id);

  const header = ['Name', 'E-Mail', 'Telefon', 'Teilnehmer', 'Nachricht', 'Angemeldet am'];
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push(
      [
        csvCell(r.name),
        csvCell(r.email),
        csvCell(r.phone),
        csvCell(r.participants),
        csvCell(r.message),
        csvCell(r.createdAt.toISOString().slice(0, 16).replace('T', ' ')),
      ].join(','),
    );
  }

  const csv = '﻿' + lines.join('\r\n');
  const slug = event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'veranstaltung';
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="anmeldungen-${slug}.csv"`,
    },
  });
}
