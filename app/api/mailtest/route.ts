import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// TEMPORÄRE Diagnose-Route — prüft die SMTP-Konfiguration/Verbindung.
// Wird nach der Fehlersuche wieder entfernt. Zugriff nur mit Token.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('t');
  if (token !== 'diag-7h3k9x2p') return new Response('forbidden', { status: 403 });

  const trim = (k: string) => process.env[k]?.trim();
  const host = trim('SMTP_HOST');
  const port = Number(trim('SMTP_PORT') ?? 587);
  const user = trim('SMTP_USER');
  const pass = trim('SMTP_PASS');
  const from = trim('MAIL_FROM');
  const bcc = trim('MAIL_BCC');

  const present = {
    SMTP_HOST: host ?? null,
    SMTP_PORT: process.env.SMTP_PORT ?? null,
    SMTP_USER: user ?? null,
    SMTP_PASS: pass ? `set (${pass.length} chars)` : 'MISSING',
    MAIL_FROM: from ?? null,
    MAIL_BCC: bcc ?? null,
  };

  if (!host || !user || !pass || !from) {
    return Response.json({ step: 'config', ok: false, present });
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transport.verify();
  } catch (e) {
    return Response.json({ step: 'verify', ok: false, present, error: String((e as Error)?.message ?? e) });
  }

  try {
    const info = await transport.sendMail({
      from,
      to: bcc || from,
      subject: 'SMTP-Diagnose (bitte ignorieren)',
      text: 'Dies ist eine automatische Test-Mail zur SMTP-Diagnose.',
    });
    return Response.json({ step: 'send', ok: true, present, messageId: info.messageId, response: info.response });
  } catch (e) {
    return Response.json({ step: 'send', ok: false, present, error: String((e as Error)?.message ?? e) });
  }
}
