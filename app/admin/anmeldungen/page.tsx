import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { listMembershipRequests } from '@/lib/db/queries/membership-requests';
import { getExistingEmails } from '@/lib/db/queries/members';
import { memberCategoryLabel } from '@/lib/member-categories';
import { setMembershipRequestStatus } from '@/lib/actions/membership-requests';
import type { MembershipRequest } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<MembershipRequest['status'], string> = {
  new: 'Neu',
  handled: 'Erledigt',
  rejected: 'Abgelehnt',
};
const STATUS_TONE: Record<MembershipRequest['status'], BadgeTone> = {
  new: 'sand',
  handled: 'forest',
  rejected: 'neutral',
};

function formatWhen(d: Date): string {
  return `${d.toLocaleDateString('de-AT', { day: '2-digit', month: 'long', year: 'numeric' })} · ${String(
    d.getHours(),
  ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default async function AdminMembershipRequestsPage() {
  const [requests, existingEmails] = await Promise.all([
    listMembershipRequests(),
    getExistingEmails(),
  ]);

  const newCount = requests.filter((r) => r.status === 'new').length;

  return (
    <main className="px-8 py-6 max-w-[1080px] mx-auto">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Mitgliedschaft
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Anmeldungen</h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Beitritts-Anmeldungen über das Formular auf der Startseite. Prüfen, ins Mitglied
          übernehmen und als erledigt markieren. Bei bereits bekannter E-Mail erscheint ein
          Dubletten-Hinweis.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Neu</div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{newCount}</div>
          <div className="mt-2 text-[13px] font-medium text-sand-700">unbearbeitet</div>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500">Gesamt</div>
          <div className="font-display text-[36px] text-stone-800 mt-1 leading-none">{requests.length}</div>
          <div className="mt-2 text-[13px] font-medium text-lake-700">Anmeldungen</div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {requests.length === 0 && (
          <div className="bg-white rounded-lg border border-stone-200 px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Anmeldungen eingegangen.
          </div>
        )}

        {requests.map((r) => {
          const isDupe = existingEmails.has(r.email.toLowerCase());
          return (
            <article
              key={r.id}
              className={[
                'bg-white rounded-xl border p-5',
                r.status === 'new' ? 'border-sand-300' : 'border-stone-200',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-display text-[20px] text-stone-800">
                      {r.firstName} {r.lastName}
                    </h2>
                    <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                    {r.isSponsor && <Badge tone="lake">Sponsor</Badge>}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
                    {formatWhen(r.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`mailto:${r.email}`}>
                    <Button variant="secondary" size="sm" icon={<Icon.Mail size={14} />}>
                      Antworten
                    </Button>
                  </a>
                </div>
              </div>

              {isDupe && (
                <div className="mt-3 flex items-start gap-2.5 rounded-md bg-sand-50 border border-sand-200 px-4 py-2.5 text-[13.5px] text-sand-800">
                  <Icon.Info size={16} className="flex-none mt-0.5" />
                  <span>
                    Achtung: Ein Mitglied mit der E-Mail <strong>{r.email}</strong> existiert bereits
                    — mögliche Dublette. Bitte vor dem Anlegen abgleichen.
                  </span>
                </div>
              )}

              <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px]">
                <Detail label="E-Mail" value={r.email} />
                <Detail label="Telefon" value={r.phone} />
                <Detail label="Adresse" value={`${r.street}, ${r.postalCode} ${r.city}`} />
                <Detail label="Kategorie" value={memberCategoryLabel(r.category)} />
                {r.planName && <Detail label="Gewähltes Paket" value={r.planName} />}
                {r.isSponsor && <Detail label="Sponsoring" value={r.sponsorNote || 'ohne nähere Angabe'} />}
              </div>

              {r.message && (
                <div className="mt-3 rounded-md bg-paper-50 border border-stone-200 px-4 py-3 text-[14px] text-stone-700">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500 block mb-1">
                    Nachricht
                  </span>
                  {r.message}
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 flex-wrap border-t border-stone-100 pt-4">
                {r.status !== 'handled' && (
                  <form action={setMembershipRequestStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="handled" />
                    <Button type="submit" variant="primary" size="sm" icon={<Icon.Check size={14} />}>
                      Als erledigt markieren
                    </Button>
                  </form>
                )}
                {r.status !== 'rejected' && (
                  <form action={setMembershipRequestStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button type="submit" variant="secondary" size="sm">
                      Ablehnen
                    </Button>
                  </form>
                )}
                {r.status !== 'new' && (
                  <form action={setMembershipRequestStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value="new" />
                    <Button type="submit" variant="ghost" size="sm">
                      Wieder als „neu"
                    </Button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-stone-500">{label}</span>
      <div className="text-stone-800">{value}</div>
    </div>
  );
}
