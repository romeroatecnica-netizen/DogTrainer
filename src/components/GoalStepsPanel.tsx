import { AlertTriangle, Award, CheckCircle2, Circle, RotateCcw, Target } from 'lucide-react';
import type { TrainingGoalContent } from '../types/training';
import type { TranslationBundle } from '../data/translations';

interface GoalStepsPanelProps {
  goal: TrainingGoalContent;
  t: TranslationBundle['goals'];
  completedSteps: Record<string, boolean>;
  onToggleStep: (stepId: string) => void;
  onResetGoal: (goal: TrainingGoalContent) => void;
}

export function GoalStepsPanel({
  goal,
  t,
  completedSteps,
  onToggleStep,
  onResetGoal,
}: GoalStepsPanelProps) {
  const completedCount = goal.steps.filter((s) => Boolean(completedSteps[s.id])).length;
  const totalCount = goal.steps.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <article className="bg-white border border-[#E2E8F0] rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2 tabular-nums">
            <span className="text-[#047857] font-semibold">
              {t.difficultyLabels[goal.difficulty]}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t.recommendedBatch}: {goal.recommendedMinutes} {t.minutesUnit}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {completedCount}/{totalCount} {t.stepsCompleted} ({percent}%)
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
            {goal.title}
          </h2>
          <p className="mt-1.5 text-sm md:text-[15px] text-slate-600 leading-relaxed">
            {goal.subtitle}
          </p>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={() => onResetGoal(goal)}
            className="no-print inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.resetGoalProgress}</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
          <span>{t.progressLabel}</span>
          <span className="tabular-nums font-semibold text-[#047857]">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#047857] transition-all duration-200 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <ol className="space-y-4">
        {goal.steps.map((step) => {
          const isDone = Boolean(completedSteps[step.id]);
          const stepNum = String(step.number).padStart(2, '0');

          return (
            <li
              id={`step-${step.id}`}
              key={step.id}
              className={`rounded-xl border p-4 md:p-5 transition-colors ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm font-bold text-[#0F766E] tabular-nums font-display">
                    {stepNum}.
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {step.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleStep(step.id)}
                  aria-pressed={isDone}
                  className={`no-print inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isDone
                      ? 'bg-[#047857] text-white border-[#047857]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#047857] hover:text-[#047857]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  )}
                  <span>{isDone ? t.stepDone : t.markStepDone}</span>
                </button>
              </div>

              <div className="space-y-2.5 text-sm leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-800">{t.whatToDoLabel}: </span>
                  <span className="text-slate-700">{step.whatToDo}</span>
                </div>

                <div className="flex items-start gap-2 text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-lg px-3 py-2">
                  <Award
                    className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-[#B45309]">
                      {t.markRewardLabel}:{' '}
                    </span>
                    <span>{step.markAndReward}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-emerald-950 bg-white border border-slate-200/80 rounded-lg px-3 py-2">
                  <Target
                    className="w-4 h-4 text-[#047857] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <span className="font-semibold text-[#047857]">
                      {t.criterionLabel}:{' '}
                    </span>
                    <span className="tabular-nums">{step.criterion}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Common Mistakes & Fatigue Check */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 font-display">
              {t.commonMistakesTitle}
            </h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm text-slate-700 leading-relaxed list-disc ps-4">
            {goal.commonMistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4">
          <h3 className="text-sm font-bold text-slate-900 font-display mb-2">
            {t.fatigueCheckTitle}
          </h3>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            {goal.fatigueCheck}
          </p>
        </div>
      </div>
    </article>
  );
}
