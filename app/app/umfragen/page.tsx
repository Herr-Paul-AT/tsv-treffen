import { MobileHeader } from '@/components/nav/MobileHeader';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { getCurrentMember } from '@/lib/db/queries/session';
import { listActiveSurveys } from '@/lib/db/queries/surveys';
import { submitVote } from '@/lib/actions/surveys';

export const dynamic = 'force-dynamic';

function pct(v: number, total: number) {
  return total > 0 ? Math.round((v / total) * 100) : 0;
}

export default async function MemberSurveysPage({
  searchParams,
}: {
  searchParams: Promise<{ voted?: string }>;
}) {
  const sp = await searchParams;
  const me = await getCurrentMember();
  const surveys = await listActiveSurveys(me?.id ?? null);

  return (
    <>
      <MobileHeader backHref="/app/dashboard" title="Umfragen" lead="Deine Stimme zählt" />
      <div className="px-5 pb-12">
        {sp.voted && (
          <div className="mb-4 flex items-start gap-2.5 rounded-md bg-forest-50 border border-forest-200 px-4 py-3 text-[14px] text-forest-800">
            <Icon.Check size={16} className="flex-none mt-0.5" /> Danke für deine Rückmeldung!
          </div>
        )}

        {surveys.length === 0 ? (
          <div className="bg-white rounded-lg border border-stone-200 px-5 py-10 text-center">
            <p className="text-[15px] text-stone-600">Aktuell gibt es keine offenen Umfragen.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {surveys.map((s) => {
              const voted = s.myOptionId != null;
              return (
                <form
                  key={s.id}
                  action={submitVote}
                  className="bg-white rounded-lg border border-stone-200 p-5"
                >
                  <input type="hidden" name="surveyId" value={s.id} />
                  <h2 className="font-display text-[20px] text-stone-800 leading-tight">{s.question}</h2>
                  {s.description && (
                    <p className="text-[14px] text-stone-600 mt-1.5 leading-snug">{s.description}</p>
                  )}

                  <div className="mt-4 space-y-2.5">
                    {s.options.map((o) => {
                      const isMine = s.myOptionId === o.id;
                      return (
                        <label
                          key={o.id}
                          className={`block rounded-md border px-4 py-3 cursor-pointer ${
                            isMine ? 'border-lake-500 bg-lake-50/50' : 'border-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="optionId"
                              value={o.id}
                              defaultChecked={isMine}
                              required
                              className="w-5 h-5 text-lake-700 focus:ring-lake-500/30"
                            />
                            <span className="flex-1 text-[15px] text-stone-800">{o.label}</span>
                            {voted && (
                              <span className="font-mono text-[12px] text-stone-500">
                                {pct(o.votes, s.totalVotes)} %
                              </span>
                            )}
                          </div>
                          {voted && (
                            <div className="mt-2 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className="h-full bg-lake-500 rounded-full"
                                style={{ width: `${pct(o.votes, s.totalVotes)}%` }}
                              />
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Button type="submit" variant="primary" icon={<Icon.Check size={16} />}>
                      {voted ? 'Auswahl ändern' : 'Abstimmen'}
                    </Button>
                    {voted && (
                      <span className="font-mono text-[11px] text-stone-500 uppercase tracking-[0.14em]">
                        {s.totalVotes} {s.totalVotes === 1 ? 'Stimme' : 'Stimmen'}
                      </span>
                    )}
                  </div>
                </form>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
