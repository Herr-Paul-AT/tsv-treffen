import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { listAllSurveys } from '@/lib/db/queries/surveys';
import { createSurvey, toggleSurvey, deleteSurvey } from '@/lib/actions/surveys';

export const dynamic = 'force-dynamic';

const fieldLabel = 'font-mono text-[11px] uppercase tracking-[0.16em] text-stone-500';

function pct(v: number, total: number) {
  return total > 0 ? Math.round((v / total) * 100) : 0;
}

export default async function AdminSurveysPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>;
}) {
  const sp = await searchParams;
  const list = await listAllSurveys();

  return (
    <main className="px-8 py-6 max-w-[1280px] mx-auto">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
          Adminbereich · Verein
        </div>
        <h1 className="font-display text-[36px] leading-[1.05] text-stone-800 mt-1">Umfragen</h1>
        <p className="text-[15px] text-stone-600 mt-2 max-w-2xl">
          Stelle den Mitgliedern eine Frage (z. B. zum Trainingslager 2027). Aktive Umfragen
          erscheinen im Mitgliederbereich unter „Umfragen".
        </p>
      </div>

      {sp.error && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-danger/5 border border-danger/20 px-4 py-3 text-[14px] text-danger">
          <Icon.Info size={16} className="flex-none mt-0.5" />
          <span>{sp.error}</span>
        </div>
      )}
      {sp.created && (
        <div className="mt-5 max-w-2xl flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
          <Icon.Check size={16} className="flex-none mt-0.5" />
          <span>Umfrage angelegt.</span>
        </div>
      )}

      {/* Neue Umfrage */}
      <form action={createSurvey} className="mt-6 max-w-2xl rounded-lg border border-stone-200 bg-white p-5 space-y-4">
        <div className="font-display text-[18px] text-stone-800">Neue Umfrage</div>
        <TextField label="Frage" name="question" required placeholder="z. B. Nimmst du am Trainingslager 2027 teil?" />
        <div>
          <label htmlFor="s-desc" className="block">
            <span className={fieldLabel}>Beschreibung (optional)</span>
            <textarea
              id="s-desc"
              name="description"
              rows={2}
              placeholder="Zusatzinfos zur Umfrage"
              className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
            />
          </label>
        </div>
        <div>
          <label htmlFor="s-opts" className="block">
            <span className={fieldLabel}>Antwortoptionen — eine pro Zeile</span>
            <textarea
              id="s-opts"
              name="options"
              rows={4}
              required
              placeholder={'Ja, bin dabei\nVielleicht\nNein'}
              className="mt-2 w-full px-4 py-3 bg-white rounded-md border border-stone-200 text-[16px] text-stone-800 placeholder-stone-400 outline-none focus:border-lake-500 focus:ring-2 focus:ring-lake-500/15 resize-y"
            />
          </label>
        </div>
        <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
          Umfrage anlegen
        </Button>
      </form>

      {/* Bestehende Umfragen */}
      <div className="mt-8 space-y-5">
        {list.length === 0 && (
          <div className="bg-white border border-stone-200 rounded-lg px-5 py-10 text-center text-[14px] text-stone-500">
            Noch keine Umfragen erstellt.
          </div>
        )}
        {list.map((s) => (
          <div key={s.id} className="max-w-2xl bg-white rounded-lg border border-stone-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-[19px] text-stone-800">{s.question}</h3>
                  {s.active ? <Badge tone="forest">Aktiv</Badge> : <Badge tone="dark">Inaktiv</Badge>}
                </div>
                {s.description && <p className="text-[13.5px] text-stone-600 mt-1">{s.description}</p>}
                <div className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em] mt-1">
                  {s.totalVotes} {s.totalVotes === 1 ? 'Stimme' : 'Stimmen'}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <form action={toggleSurvey}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="active" value={s.active ? '0' : '1'} />
                  <Button type="submit" variant="secondary" size="sm">
                    {s.active ? 'Deaktivieren' : 'Aktivieren'}
                  </Button>
                </form>
                <DeleteButton
                  action={deleteSurvey}
                  id={s.id}
                  label="Löschen"
                  confirmText="Umfrage und alle Stimmen wirklich löschen?"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {s.options.map((o) => (
                <div key={o.id}>
                  <div className="flex items-center justify-between text-[13.5px] text-stone-700">
                    <span>{o.label}</span>
                    <span className="font-mono text-[12px] text-stone-500">
                      {o.votes} · {pct(o.votes, s.totalVotes)} %
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-lake-500 rounded-full"
                      style={{ width: `${pct(o.votes, s.totalVotes)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
