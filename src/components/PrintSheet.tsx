import type { DogProfile, LanguageCode, SessionLogEntry, TrainingGoalContent } from '../types/training';
import type { TranslationBundle } from '../data/translations';

interface PrintSheetProps {
  t: TranslationBundle;
  lang: LanguageCode;
  profile: DogProfile;
  goal: TrainingGoalContent;
  completedSteps: Record<string, boolean>;
  recentSessions: SessionLogEntry[];
}

export function PrintSheet({
  t,
  lang,
  profile,
  goal,
  completedSteps,
  recentSessions,
}: PrintSheetProps) {
  const goalSessions = recentSessions.filter((s) => s.goalId === goal.id).slice(0, 5);
  const printedDate = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="hidden print-only text-slate-900">
      <header className="border-b-2 border-slate-900 pb-3 mb-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-600">{t.print.sheetTitle}</p>
          <h1 className="text-2xl font-bold font-display">{goal.title}</h1>
        </div>
        <div className="text-xs text-slate-600 tabular-nums">
          {t.print.generatedOn}: {printedDate}
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3 border border-slate-300 rounded-lg p-3 mb-5 text-xs">
        <div>
          <span className="font-semibold">{t.print.dogLabel}: </span>
          <span>{profile.name || '—'}</span>
        </div>
        <div>
          <span className="font-semibold">{t.print.stageLabel}: </span>
          <span>{t.profile.stages[profile.stage]}</span>
        </div>
        <div>
          <span className="font-semibold">{t.print.rewardLabel}: </span>
          <span>{profile.favoriteReward || '—'}</span>
        </div>
      </section>

      <p className="text-sm text-slate-700 mb-4">{goal.subtitle}</p>

      <ol className="space-y-3 mb-6">
        {goal.steps.map((step) => {
          const done = Boolean(completedSteps[step.id]);
          return (
            <li key={step.id} className="border border-slate-300 rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 font-bold text-sm mb-1">
                <span>
                  {done ? '[x]' : '[ ]'} {String(step.number).padStart(2, '0')}. {step.title}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-1">
                <strong>{t.goals.whatToDoLabel}:</strong> {step.whatToDo}
              </p>
              <p className="text-xs leading-relaxed mb-1">
                <strong>{t.goals.markRewardLabel}:</strong> {step.markAndReward}
              </p>
              <p className="text-xs leading-relaxed tabular-nums">
                <strong>{t.goals.criterionLabel}:</strong> {step.criterion}
              </p>
            </li>
          );
        })}
      </ol>

      <section className="grid grid-cols-2 gap-4 mb-6 text-xs">
        <div className="border border-slate-300 rounded-lg p-3">
          <h2 className="font-bold mb-1.5">{t.goals.commonMistakesTitle}</h2>
          <ul className="list-disc ps-4 space-y-1">
            {goal.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="border border-slate-300 rounded-lg p-3">
          <h2 className="font-bold mb-1.5">{t.goals.fatigueCheckTitle}</h2>
          <p>{goal.fatigueCheck}</p>
        </div>
      </section>

      <section className="border border-slate-300 rounded-lg p-3 text-xs">
        <h2 className="font-bold mb-2">{t.print.notesBoxTitle}</h2>
        {goalSessions.length > 0 ? (
          <ul className="space-y-1 tabular-nums">
            {goalSessions.map((s) => (
              <li key={s.id}>
                • {new Date(s.createdAt).toLocaleDateString(lang)} — {s.successes}/{s.attempts} (
                {s.successRate}%) {s.bestReward ? `· ${s.bestReward}` : ''}{' '}
                {s.distractionNote ? `— ${s.distractionNote}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-20 border-t border-dashed border-slate-300 mt-2" />
        )}
      </section>
    </div>
  );
}
