import { useEffect, useMemo, useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  applySeoMetadata,
  detectInitialLanguage,
} from './config/seo';
import { getTranslations } from './data/translations';
import { getGoalsForLanguage } from './data/goals';
import type {
  DogProfile,
  LanguageCode,
  PawCueStorageState,
  SessionLogEntry,
  TrainingGoalContent,
  TrainingGoalId,
} from './types/training';
import {
  loadStorageState,
  saveStorageState,
  validateImportedState,
} from './utils/storage';
import { DogProfileBar } from './components/DogProfileBar';
import { GoalStepsPanel } from './components/GoalStepsPanel';
import { TrainingProgressionSvg } from './components/TrainingProgressionSvg';
import { SessionTimerCard } from './components/SessionTimerCard';
import { SessionHistoryList } from './components/SessionHistoryList';
import { AdSlot } from './components/AdSlot';
import { GearAffiliateSection } from './components/GearAffiliateSection';
import { EditorialSeoSection } from './components/EditorialSeoSection';
import { PrintSheet } from './components/PrintSheet';

export default function App() {
  const [storage, setStorage] = useState<PawCueStorageState>(() => loadStorageState());
  const [lang, setLang] = useState<LanguageCode>(() =>
    detectInitialLanguage(loadStorageState().language)
  );
  const [activeGoalId, setActiveGoalId] = useState<TrainingGoalId>('recall');

  // Live batch repetition state (with undo stack)
  const [repHistory, setRepHistory] = useState<Array<'success' | 'missed'>>([]);

  const t = useMemo(() => getTranslations(lang), [lang]);
  const goals = useMemo(() => getGoalsForLanguage(lang), [lang]);
  const activeGoal = useMemo(
    () => goals.find((g) => g.id === activeGoalId) ?? goals[0],
    [goals, activeGoalId]
  );

  // Persist storage state changes locally
  useEffect(() => {
    saveStorageState({ ...storage, language: lang });
  }, [storage, lang]);

  // Update SEO metadata, canonical/hreflang, dir="rtl|ltr", and JSON-LD
  useEffect(() => {
    applySeoMetadata({
      lang,
      title: t.seoTitle,
      description: t.seoDescription,
      appName: t.appName,
      activeGoal,
      faqs: t.editorial.faqs,
    });
  }, [lang, t, activeGoal]);

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLang(nextLang);
    setStorage((prev) => ({ ...prev, language: nextLang }));
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextLang === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', nextLang);
      }
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const handleProfileChange = (updated: DogProfile) => {
    setStorage((prev) => ({ ...prev, profile: updated }));
  };

  const handleToggleStep = (stepId: string) => {
    setStorage((prev) => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        [stepId]: !prev.completedSteps[stepId],
      },
    }));
  };

  const handleResetGoal = (goal: TrainingGoalContent) => {
    setStorage((prev) => {
      const nextCompleted = { ...prev.completedSteps };
      for (const s of goal.steps) {
        delete nextCompleted[s.id];
      }
      return { ...prev, completedSteps: nextCompleted };
    });
  };

  const successes = useMemo(
    () => repHistory.filter((r) => r === 'success').length,
    [repHistory]
  );
  const missed = useMemo(
    () => repHistory.filter((r) => r === 'missed').length,
    [repHistory]
  );

  const handleAddSuccess = () => setRepHistory((prev) => [...prev, 'success']);
  const handleAddMissed = () => setRepHistory((prev) => [...prev, 'missed']);
  const handleUndoRep = () => setRepHistory((prev) => prev.slice(0, -1));
  const handleResetReps = () => setRepHistory([]);

  const handleSaveSession = (payload: {
    durationSeconds: number;
    successes: number;
    attempts: number;
    bestReward: string;
    distractionNote: string;
  }) => {
    const rate =
      payload.attempts > 0
        ? Math.round((payload.successes / payload.attempts) * 100)
        : 0;
    const newEntry: SessionLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      goalId: activeGoal.id,
      dogName: storage.profile.name.trim(),
      durationSeconds: payload.durationSeconds,
      successes: payload.successes,
      attempts: payload.attempts,
      successRate: rate,
      bestReward: payload.bestReward,
      distractionNote: payload.distractionNote,
    };

    setStorage((prev) => ({
      ...prev,
      sessions: [newEntry, ...prev.sessions].slice(0, 100),
    }));
    setRepHistory([]);
  };

  const handleDeleteSession = (id: string) => {
    setStorage((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
  };

  const handleClearSessions = () => {
    setStorage((prev) => ({ ...prev, sessions: [] }));
  };

  const handleExportJson = () => {
    const payload: PawCueStorageState = {
      ...storage,
      language: lang,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = storage.profile.name.trim()
      ? storage.profile.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : 'dog';
    a.href = url;
    a.download = `pawcue-${slug}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const valid = validateImportedState(parsed);
      if (!valid) return false;
      setStorage(valid);
      if (valid.language) {
        handleLanguageChange(valid.language);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleCopyLink = async (): Promise<boolean> => {
    const targetUrl =
      lang === 'en'
        ? 'https://pawcue.bastelar.com/'
        : `https://pawcue.bastelar.com/?lang=${lang}`;
    try {
      await navigator.clipboard.writeText(targetUrl);
      return true;
    } catch {
      return false;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeCompletedCount = activeGoal.steps.filter((s) =>
    Boolean(storage.completedSteps[s.id])
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 lg:pb-0">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element brand wordmark */}
          <a
            href="#trainer"
            className="text-lg font-extrabold tracking-tight text-[#047857] font-display whitespace-nowrap shrink-0"
          >
            PawCue
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#trainer"
              className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.trainer}
            </a>
            <a
              href="#session"
              className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.session}
            </a>
            <a
              href="#guide"
              className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.guide}
            </a>
            <a
              href="#faq"
              className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: Single Language Selector action */}
          <div className="flex items-center shrink-0">
            <label htmlFor="pawcue-lang-select" className="sr-only">
              {t.nav.languageLabel}
            </label>
            <div className="relative inline-flex items-center">
              <Globe
                className="w-3.5 h-3.5 text-[#0F766E] pointer-events-none absolute start-2.5"
                aria-hidden="true"
              />
              <select
                id="pawcue-lang-select"
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                className="min-h-[38px] ps-8 pe-3 py-1.5 text-xs font-semibold text-slate-800 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#047857]/30 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8">
        {/* Hero Header */}
        <section className="no-print max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display text-balance leading-tight">
            {t.hero.title}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {t.hero.subtitle}
          </p>
        </section>

        {/* Local Dog Profile & JSON/Print Bar */}
        <DogProfileBar
          profile={storage.profile}
          t={t.profile}
          onChangeProfile={handleProfileChange}
          onExportJson={handleExportJson}
          onImportFile={handleImportFile}
          onCopyLink={handleCopyLink}
          onPrint={handlePrint}
        />

        {/* Interactive Trainer Workspace */}
        <section id="trainer" aria-label={t.goals.sectionTitle} className="no-print space-y-5">
          {/* 8-Goal Segmented Selector */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-800 font-display mb-3">
              {t.goals.sectionTitle}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {goals.map((goal) => {
                const isSelected = goal.id === activeGoal.id;
                const doneCount = goal.steps.filter((s) =>
                  Boolean(storage.completedSteps[s.id])
                ).length;

                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setActiveGoalId(goal.id)}
                    aria-pressed={isSelected}
                    className={`text-start min-h-[56px] px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-[#047857] text-white border-[#047857]'
                        : 'bg-[#F8FAFC] text-slate-800 border-slate-200 hover:border-[#047857]/60 hover:bg-white'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold font-display leading-snug line-clamp-1">
                      {goal.shortTitle}
                    </span>
                    <span
                      className={`text-[11px] tabular-nums ${
                        isSelected ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {doneCount}/{goal.steps.length} · {goal.recommendedMinutes}{' '}
                      {t.goals.minutesUnit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two-Column Main Split: Steps on Left, SVG + Timer + Log on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <GoalStepsPanel
                goal={activeGoal}
                t={t.goals}
                completedSteps={storage.completedSteps}
                onToggleStep={handleToggleStep}
                onResetGoal={handleResetGoal}
              />
            </div>

            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
              <TrainingProgressionSvg
                t={t.svg}
                completedStepCount={activeCompletedCount}
                totalSteps={activeGoal.steps.length}
              />

              <SessionTimerCard
                goal={activeGoal}
                dogName={storage.profile.name}
                defaultReward={storage.profile.favoriteReward}
                t={t.timer}
                successes={successes}
                attempts={missed}
                onAddSuccess={handleAddSuccess}
                onAddMissed={handleAddMissed}
                onUndoRep={handleUndoRep}
                onResetReps={handleResetReps}
                onSaveSession={handleSaveSession}
              />

              <SessionHistoryList
                sessions={storage.sessions}
                goals={goals}
                lang={lang}
                t={t.history}
                onDeleteSession={handleDeleteSession}
                onClearAll={handleClearSessions}
              />
            </div>
          </div>
        </section>

        {/* Media.net Ad Slot 1 (between trainer workspace & editorial guide) */}
        <AdSlot
          slotId="pawcue-mid-responsive"
          placement="mid"
          sponsoredLabel={t.ads.sponsoredLabel}
          hintText={t.ads.slotMidHint}
        />

        {/* Contextual Training Gear Affiliate Block */}
        <GearAffiliateSection t={t.gear} />

        {/* Editorial SEO Guide, Fatigue Table, Interactive FAQ & Transparent Notice */}
        <EditorialSeoSection t={t.editorial} />

        {/* Media.net Ad Slot 2 (bottom placement before footer) */}
        <AdSlot
          slotId="pawcue-bottom-responsive"
          placement="bottom"
          sponsoredLabel={t.ads.sponsoredLabel}
          hintText={t.ads.slotBottomHint}
        />

        {/* Print-Only Clean Sheet */}
        <PrintSheet
          t={t}
          lang={lang}
          profile={storage.profile}
          goal={activeGoal}
          completedSteps={storage.completedSteps}
          recentSessions={storage.sessions}
        />
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-[#E2E8F0] bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p className="font-medium text-slate-700">{t.footer.brandLine}</p>
          <p>{t.footer.canonicalNote}</p>
        </div>
      </footer>

      {/* Mobile One-Handed Quick Bar (compact h-14 within 15% sticky cap) */}
      <div className="no-print lg:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 flex items-center justify-between gap-2">
        <a
          href="#trainer"
          className="flex-1 min-h-[40px] flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg whitespace-nowrap"
        >
          {t.mobileBar.steps}
        </a>
        <a
          href="#session"
          className="flex-1 min-h-[40px] flex items-center justify-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg whitespace-nowrap"
        >
          {t.mobileBar.timer}
        </a>
        <button
          type="button"
          onClick={handleAddSuccess}
          className="flex-[1.4] min-h-[42px] inline-flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#047857] active:scale-[0.98] rounded-lg whitespace-nowrap tabular-nums cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>
            {t.mobileBar.quickSuccess} ({successes})
          </span>
        </button>
      </div>
    </div>
  );
}
