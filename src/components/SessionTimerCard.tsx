import { useEffect, useState } from 'react';
import {
  Check,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Undo2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { TrainingGoalContent } from '../types/training';
import type { TranslationBundle } from '../data/translations';
import { playSoftBatchChime } from '../utils/chime';

interface SessionTimerCardProps {
  goal: TrainingGoalContent;
  dogName: string;
  defaultReward: string;
  t: TranslationBundle['timer'];
  successes: number;
  attempts: number;
  onAddSuccess: () => void;
  onAddMissed: () => void;
  onUndoRep: () => void;
  onResetReps: () => void;
  onSaveSession: (payload: {
    durationSeconds: number;
    successes: number;
    attempts: number;
    bestReward: string;
    distractionNote: string;
  }) => void;
}

const PRESETS = [1, 3, 5];

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function SessionTimerCard({
  goal,
  defaultReward,
  t,
  successes,
  attempts,
  onAddSuccess,
  onAddMissed,
  onUndoRep,
  onResetReps,
  onSaveSession,
}: SessionTimerCardProps) {
  const [presetMinutes, setPresetMinutes] = useState<number>(goal.recommendedMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    goal.recommendedMinutes * 60
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedNotice, setCompletedNotice] = useState<boolean>(false);
  const [bestReward, setBestReward] = useState<string>(defaultReward);
  const [distractionNote, setDistractionNote] = useState<string>('');
  const [savedJustNow, setSavedJustNow] = useState<boolean>(false);

  // Sync timer default preset when switching training goals while idle
  useEffect(() => {
    if (!isRunning) {
      setPresetMinutes(goal.recommendedMinutes);
      setRemainingSeconds(goal.recommendedMinutes * 60);
      setCompletedNotice(false);
    }
  }, [goal.id, goal.recommendedMinutes]);

  useEffect(() => {
    if (!bestReward && defaultReward) {
      setBestReward(defaultReward);
    }
  }, [defaultReward]);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setIsRunning(false);
          setCompletedNotice(true);
          if (soundEnabled) {
            playSoftBatchChime();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRunning, soundEnabled]);

  const selectPreset = (mins: number) => {
    setIsRunning(false);
    setCompletedNotice(false);
    setPresetMinutes(mins);
    setRemainingSeconds(mins * 60);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setCompletedNotice(false);
    setRemainingSeconds(presetMinutes * 60);
  };

  const totalAttempts = successes + attempts;
  const successRate =
    totalAttempts > 0 ? Math.round((successes / totalAttempts) * 100) : 0;
  const criterionReached =
    totalAttempts >= 5 && successRate >= goal.targetCriterionPercent;

  const elapsedSeconds = Math.max(
    1,
    presetMinutes * 60 - remainingSeconds || presetMinutes * 60
  );

  const handleSave = () => {
    onSaveSession({
      durationSeconds: remainingSeconds === presetMinutes * 60 ? presetMinutes * 60 : elapsedSeconds,
      successes,
      attempts: totalAttempts,
      bestReward: bestReward.trim(),
      distractionNote: distractionNote.trim(),
    });
    setSavedJustNow(true);
    setDistractionNote('');
    window.setTimeout(() => setSavedJustNow(false), 2500);
  };

  return (
    <section
      id="session"
      aria-label={t.title}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 no-print"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-bold text-slate-900 font-display">{t.title}</h2>
        <button
          type="button"
          onClick={() => setSoundEnabled((v) => !v)}
          aria-pressed={soundEnabled}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          )}
          <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
        </button>
      </div>

      {/* Timer Presets & Clock */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-600">{t.presetsLabel}</span>
          <div className="inline-flex items-center gap-1.5">
            {PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => selectPreset(m)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg border tabular-nums transition-colors whitespace-nowrap cursor-pointer ${
                  presetMinutes === m
                    ? 'bg-[#0F766E] text-white border-[#0F766E]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {m} {t.minSuffix}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 my-2">
          <div
            aria-live="polite"
            className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums font-display"
          >
            {formatClock(remainingSeconds)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCompletedNotice(false);
                if (remainingSeconds === 0) {
                  setRemainingSeconds(presetMinutes * 60);
                }
                setIsRunning((r) => !r);
              }}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#047857] hover:bg-[#065F46] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isRunning ? (
                <Pause className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{isRunning ? t.pause : t.start}</span>
            </button>

            <button
              type="button"
              onClick={handleResetTimer}
              aria-label={t.reset}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {completedNotice && (
          <p
            role="status"
            className="mt-3 text-xs font-medium text-[#047857] bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"
          >
            {t.completedBanner}
          </p>
        )}
      </div>

      {/* One-Handed Repetition Counter */}
      <div className="mt-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-semibold text-slate-700">{t.repCounterTitle}</h3>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onUndoRep}
              disabled={totalAttempts === 0}
              className="inline-flex items-center gap-1 min-h-[36px] px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 bg-white border border-slate-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
            >
              <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.undo}</span>
            </button>
            <button
              type="button"
              onClick={onResetReps}
              disabled={totalAttempts === 0}
              className="min-h-[36px] px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 bg-white border border-slate-200 rounded-lg cursor-pointer disabled:cursor-not-allowed"
            >
              {t.resetReps}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onAddSuccess}
            className="inline-flex items-center justify-center gap-1.5 min-h-[52px] px-4 py-3 text-sm font-bold text-white bg-[#047857] hover:bg-[#065F46] active:scale-[0.99] rounded-xl transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>{t.plusSuccess}</span>
          </button>

          <button
            type="button"
            onClick={onAddMissed}
            className="inline-flex items-center justify-center gap-1.5 min-h-[52px] px-4 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 active:scale-[0.99] rounded-xl transition-all whitespace-nowrap cursor-pointer"
          >
            <span>{t.plusAttempt}</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2 text-xs">
          <div className="tabular-nums text-slate-700">
            <span className="font-semibold">{t.successRateLabel}: </span>
            <span className="text-sm font-bold text-slate-900">
              {successes}/{totalAttempts} ({successRate}%)
            </span>
          </div>
          <span
            className={`font-semibold tabular-nums ${
              criterionReached ? 'text-[#047857]' : 'text-[#D97706]'
            }`}
          >
            {criterionReached ? t.criterionMet : t.keepPracticing}
          </span>
        </div>
      </div>

      {/* Observation Notes & Save */}
      <div className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="session-best-reward"
            className="block text-xs font-semibold text-slate-600 mb-1"
          >
            {t.bestRewardLabel}
          </label>
          <input
            id="session-best-reward"
            type="text"
            maxLength={100}
            value={bestReward}
            onChange={(e) => setBestReward(e.target.value)}
            placeholder={t.bestRewardPlaceholder}
            className="w-full min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857]"
          />
        </div>

        <div>
          <label
            htmlFor="session-distraction-note"
            className="block text-xs font-semibold text-slate-600 mb-1"
          >
            {t.distractionNoteLabel}
          </label>
          <textarea
            id="session-distraction-note"
            rows={2}
            maxLength={280}
            value={distractionNote}
            onChange={(e) => setDistractionNote(e.target.value)}
            placeholder={t.distractionNotePlaceholder}
            className="w-full px-3 py-2 text-sm text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#0D9488] rounded-xl transition-colors cursor-pointer"
        >
          {savedJustNow ? (
            <Check className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{savedJustNow ? t.savedFeedback : t.saveSession}</span>
        </button>
      </div>
    </section>
  );
}
