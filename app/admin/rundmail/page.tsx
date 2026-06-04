import { Avatar, type AvatarTone } from '@/components/ui/Avatar';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listNewsletters } from '@/lib/db/queries/newsletters';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<string, BadgeTone> = {
  draft: 'neutral',
  queued: 'sand',
  sent: 'forest',
  failed: 'danger',
};

const STATUS_LABEL: Record<string, string> = {
  draft: 'Entwurf',
  queued: 'Wartet',
  sent: 'Gesendet',
  failed: 'Fehler',
};

const AUDIENCE_LABEL: Record<string, string> = {
  all: 'Alle Mitglieder',
  active: 'Aktive Mitglieder',
  probe: 'Probemitglieder',
  team: 'Mannschaft',
  custom: 'Auswahl',
};

export default async function AdminNewslettersPage() {
  const items = await listNewsletters();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
            Adminbereich · Kommunikation
          </div>
          <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Rundmail</h1>
          <p className="text-[15px] text-stone-600 mt-2 max-w-xl">
            Newsletter an Mitglieder, Mannschaften oder die ganze Vereinsgemeinde.
          </p>
        </div>
        <Button variant="primary" icon={<Icon.Plus size={16} />}>
          Neue Rundmail
        </Button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <h2 className="font-display text-[22px] text-stone-800 mb-3">Versand-Historie</h2>
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-lg px-5 py-8 text-center text-[14px] text-stone-500">
                Noch keine Rundmails.
              </div>
            )}
            {items.map((n) => (
              <article key={n.id} className="bg-white border border-stone-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={STATUS_TONE[n.status]}>{STATUS_LABEL[n.status]}</Badge>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                        {AUDIENCE_LABEL[n.audience]} · {n.recipientCount} Empfänger:innen
                      </span>
                    </div>
                    <h3 className="font-display text-[20px] text-stone-800 leading-tight mt-2">
                      {n.subject}
                    </h3>
                    <p className="text-[13.5px] text-stone-600 mt-2 leading-[1.55] line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                  <div className="text-right flex-none">
                    {n.sentAt && (
                      <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">
                        {n.sentAt.toLocaleDateString('de-AT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {n.authorName && (
                      <div className="text-[12.5px] text-stone-700 mt-1">{n.authorName}</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Icon.External size={14} />}>
                    Vorschau
                  </Button>
                  {n.status === 'draft' && (
                    <Button variant="primary" size="sm" icon={<Icon.Check size={14} />}>
                      Jetzt senden
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-stone-800 text-paper-50 rounded-xl p-5 relative overflow-hidden">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-sand-300">
              Schnellentwurf
            </div>
            <h3 className="font-display text-[20px] mt-2 leading-tight">Rundmail vorbereiten</h3>
            <form className="mt-4 space-y-3">
              <div>
                <label className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper-100/70">
                  Empfänger
                </label>
                <select className="mt-1 w-full h-10 bg-white/5 border border-white/15 rounded-md px-3 text-[14px] text-paper-50 focus:outline-none focus:border-sand-400">
                  <option>Aktive Mitglieder</option>
                  <option>Alle Mitglieder</option>
                  <option>Probemitglieder</option>
                  <option>Mannschaft Herren II</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper-100/70">
                  Betreff
                </label>
                <input
                  type="text"
                  defaultValue=""
                  placeholder="z. B. Erinnerung Training"
                  className="mt-1 w-full h-10 bg-white/5 border border-white/15 rounded-md px-3 text-[14px] text-paper-50 placeholder-paper-100/40 focus:outline-none focus:border-sand-400"
                />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper-100/70">
                  Inhalt
                </label>
                <textarea
                  rows={5}
                  placeholder="Liebe Mitglieder, …"
                  className="mt-1 w-full bg-white/5 border border-white/15 rounded-md px-3 py-2 text-[14px] text-paper-50 placeholder-paper-100/40 focus:outline-none focus:border-sand-400 leading-[1.55]"
                />
              </div>
              <Button variant="accent" size="md" className="w-full" iconAfter={<Icon.ArrowRight size={14} />}>
                Als Entwurf speichern
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-5">
            <h3 className="font-display text-[18px] text-stone-800">Letzte Empfänger</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {['MH', 'KW', 'JS', 'AB', 'EM', 'GP'].map((i, idx) => (
                <Avatar key={i} initials={i} size={28} tone={(['lake', 'sand', 'forest', 'stone'] as AvatarTone[])[idx % 4]} />
              ))}
            </div>
            <p className="text-[12.5px] text-stone-500 mt-3 leading-[1.5]">
              Aktive Mitglieder, die im letzten Versand enthalten waren.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
