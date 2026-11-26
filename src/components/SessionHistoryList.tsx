import { Trash2 } from 'lucide-react';
import type { LanguageCode, SessionLogEntry, TrainingGoalContent } from '../types/training';
import type { TranslationBundle } from '../data/translations';

interface SessionHistoryListProps {
  sessions: SessionLogEntry[];
  goals: TrainingGoalContent[];
  lang: LanguageCode;
  t: TranslationBundle['history'];
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

function formatDurationCompact(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SessionHistoryList({
  sessions,
  goals,
  lang,
  t,
  onDeleteSession,
  onClearAll,
}: SessionHistoryListProps) {
  const goalMap = new Map(goals.map((g) => [g.id, g.shortTitle]));

  return (
    <section
      aria-label={t.title}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 no-print"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-base font-bold text-slate-900 font-display">{t.title}</h2>
        {sessions.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-slate-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed py-2">
          {t.empty}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto pe-1">
          {sessions.slice(0, 12).map((entry) => {
            const goalTitle = goalMap.get(entry.goalId) ?? entry.goalId;
            const dateStr = new Intl.DateTimeFormat(lang, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(entry.createdAt));

            return (
              <li key={entry.id} className="py-3 first:pt-1 last:pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {goalTitle}
                      {entry.dogName ? ` · ${entry.dogName}` : ''}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 tabular-nums flex flex-wrap items-center gap-1.5">
                      <span>{dateStr}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#047857]">
                        {entry.successes}/{entry.attempts} {t.repsSummary} ({entry.successRate}%)
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {formatDurationCompact(entry.durationSeconds)} {t.durationSummary}
                      </span>
                    </div>
                    {(entry.bestReward || entry.distractionNote) && (
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {entry.bestReward ? `${entry.bestReward}` : ''}
                        {entry.bestReward && entry.distractionNote ? ' — ' : ''}
                        {entry.distractionNote}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSession(entry.id)}
                    aria-label={t.deleteEntry}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-red-600 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
