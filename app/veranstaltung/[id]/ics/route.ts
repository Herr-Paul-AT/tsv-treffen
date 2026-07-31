import { getEvent } from '@/lib/db/queries/events';

export const dynamic = 'force-dynamic';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** UTC-Zeitstempel im iCalendar-Format: YYYYMMDDTHHMMSSZ */
function icsDateTime(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function icsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

function escapeICS(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return new Response('Not found', { status: 404 });

  const start = event.startsAt;
  const end = event.endsAt ?? new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = icsDateTime(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TSV Schloss Treffen//Kalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@tsv-treffen.at`,
    `DTSTAMP:${stamp}`,
    event.allDay ? `DTSTART;VALUE=DATE:${icsDate(start)}` : `DTSTART:${icsDateTime(start)}`,
    event.allDay ? `DTEND;VALUE=DATE:${icsDate(end)}` : `DTEND:${icsDateTime(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    event.location ? `LOCATION:${escapeICS(event.location)}` : '',
    event.description ? `DESCRIPTION:${escapeICS(event.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  const body = lines.join('\r\n');
  const filename = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'termin'}.ics`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
