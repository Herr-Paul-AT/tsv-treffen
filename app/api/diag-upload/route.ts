import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * TEMPORÄRE Diagnose (wird nach der Prüfung wieder entfernt): Lädt sharp auf
 * dem Server und macht eine Test-Verkleinerung, damit wir sehen, ob der
 * Upload-Pfad auf Vercel funktioniert. Token-geschützt, gibt keine Secrets aus.
 */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get('t');
  if (t !== 'diag-9pq4x7k2') return new NextResponse('Not found', { status: 404 });

  const out: Record<string, unknown> = {
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    serviceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  };
  try {
    const mod = await import('sharp');
    const sharp = (mod.default ?? mod) as typeof import('sharp');
    out.sharpLoaded = true;
    out.sharpVersion = sharp.versions?.sharp ?? null;
    // 64x64 rotes PNG erzeugen und auf 16x16 JPEG verkleinern
    const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#c00' } })
      .png()
      .toBuffer();
    const jpg = await sharp(png).resize(16, 16).jpeg({ quality: 80 }).toBuffer();
    out.resizeOk = jpg.length > 0;
    out.resizedBytes = jpg.length;
  } catch (e) {
    out.sharpLoaded = false;
    out.sharpError = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(out);
}
