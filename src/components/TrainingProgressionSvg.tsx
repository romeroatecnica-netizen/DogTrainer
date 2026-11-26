import { useState } from 'react';
import type { TranslationBundle } from '../data/translations';

interface TrainingProgressionSvgProps {
  t: TranslationBundle['svg'];
  completedStepCount: number;
  totalSteps: number;
}

export function TrainingProgressionSvg({
  t,
  completedStepCount,
  totalSteps,
}: TrainingProgressionSvgProps) {
  const [mode, setMode] = useState<'ladder' | 'cycle'>('ladder');

  const progressRatio = totalSteps > 0 ? completedStepCount / totalSteps : 0;
  const activeStage = progressRatio >= 0.8 ? 3 : progressRatio >= 0.4 ? 2 : 1;

  return (
    <section
      aria-label={t.cardTitle}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-5 no-print"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-bold text-slate-900 font-display">{t.cardTitle}</h2>
        <div
          role="tablist"
          aria-label={t.cardTitle}
          className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'ladder'}
            onClick={() => setMode('ladder')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'ladder'
                ? 'bg-white text-[#047857] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeLadder}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'cycle'}
            onClick={() => setMode('cycle')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'cycle'
                ? 'bg-white text-[#047857] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeCycle}
          </button>
        </div>
      </div>

      {mode === 'ladder' ? (
        <div dir="ltr">
          <svg
            viewBox="0 0 560 220"
            role="img"
            aria-label={t.ladderTitle}
            className="w-full h-auto block rounded-xl bg-[#F8FAFC] border border-slate-200/70"
          >
            {/* Subtle horizontal baseline grid */}
            <line x1="24" y1="184" x2="536" y2="184" stroke="#CBD5E1" strokeWidth="1.5" />
            <line
              x1="24"
              y1="130"
              x2="536"
              y2="130"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="24"
              y1="76"
              x2="536"
              y2="76"
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Connecting progression arrows */}
            <path
              d="M 164 148 C 186 148, 186 106, 206 106"
              fill="none"
              stroke="#0F766E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon points="204,101 212,106 204,111" fill="#0F766E" />

            <path
              d="M 352 106 C 372 106, 372 58, 392 58"
              fill="none"
              stroke="#D97706"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <polygon points="390,53 398,58 390,63" fill="#D97706" />

            {/* Stage 1 Step */}
            <rect
              x="24"
              y="124"
              width="140"
              height="60"
              rx="10"
              fill={activeStage >= 1 ? '#ECFDF5' : '#FFFFFF'}
              stroke={activeStage === 1 ? '#047857' : '#94A3B8'}
              strokeWidth={activeStage === 1 ? '2' : '1.25'}
            />
            <circle cx="42" cy="144" r="9" fill="#047857" />
            <text
              x="42"
              y="148"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              1
            </text>
            <text
              x="58"
              y="147"
              fill="#0F172A"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.stage1Title.replace(/^1\.\s*/, '')}
            </text>
            <text
              x="34"
              y="168"
              fill="#475569"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {t.stage1Sub}
            </text>

            {/* Stage 2 Step */}
            <rect
              x="212"
              y="78"
              width="140"
              height="60"
              rx="10"
              fill={activeStage >= 2 ? '#ECFDF5' : '#FFFFFF'}
              stroke={activeStage === 2 ? '#047857' : '#CBD5E1'}
              strokeWidth={activeStage === 2 ? '2' : '1.25'}
            />
            <circle cx="230" cy="98" r="9" fill={activeStage >= 2 ? '#0F766E' : '#64748B'} />
            <text
              x="230"
              y="102"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              2
            </text>
            <text
              x="246"
              y="101"
              fill="#0F172A"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.stage2Title.replace(/^2\.\s*/, '')}
            </text>
            <text
              x="222"
              y="122"
              fill="#475569"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {t.stage2Sub}
            </text>

            {/* Stage 3 Step */}
            <rect
              x="398"
              y="28"
              width="140"
              height="60"
              rx="10"
              fill={activeStage >= 3 ? '#FFFBEB' : '#FFFFFF'}
              stroke={activeStage === 3 ? '#D97706' : '#CBD5E1'}
              strokeWidth={activeStage === 3 ? '2' : '1.25'}
            />
            <circle cx="416" cy="48" r="9" fill="#D97706" />
            <text
              x="416"
              y="52"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              3
            </text>
            <text
              x="432"
              y="51"
              fill="#0F172A"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.stage3Title.replace(/^3\.\s*/, '')}
            </text>
            <text
              x="408"
              y="72"
              fill="#475569"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {t.stage3Sub}
            </text>

            {/* Footer guidance inside SVG */}
            <text
              x="280"
              y="204"
              textAnchor="middle"
              fill="#334155"
              fontSize="10.5"
              fontWeight="500"
              fontFamily="Inter, sans-serif"
            >
              {t.rule3Ds}
            </text>
          </svg>
        </div>
      ) : (
        <div dir="ltr">
          <svg
            viewBox="0 0 560 220"
            role="img"
            aria-label={t.cycleTitle}
            className="w-full h-auto block rounded-xl bg-[#F8FAFC] border border-slate-200/70"
          >
            {/* Central loop ring */}
            <rect
              x="120"
              y="42"
              width="320"
              height="132"
              rx="66"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Directional arrowheads on loop */}
            <polygon points="278,37 288,42 278,47" fill="#047857" />
            <polygon points="282,169 272,174 282,179" fill="#0F766E" />

            {/* Node 1: Cue */}
            <rect
              x="26"
              y="22"
              width="172"
              height="56"
              rx="10"
              fill="#FFFFFF"
              stroke="#047857"
              strokeWidth="1.5"
            />
            <text
              x="40"
              y="45"
              fill="#047857"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.cycleCue}
            </text>
            <text x="40" y="64" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif">
              {t.cycleCueSub}
            </text>

            {/* Node 2: Action */}
            <rect
              x="362"
              y="22"
              width="172"
              height="56"
              rx="10"
              fill="#FFFFFF"
              stroke="#0F766E"
              strokeWidth="1.5"
            />
            <text
              x="376"
              y="45"
              fill="#0F766E"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.cycleAction}
            </text>
            <text x="376" y="64" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif">
              {t.cycleActionSub}
            </text>

            {/* Node 3: Mark & Reward */}
            <rect
              x="362"
              y="138"
              width="172"
              height="56"
              rx="10"
              fill="#FFFBEB"
              stroke="#D97706"
              strokeWidth="1.75"
            />
            <text
              x="376"
              y="161"
              fill="#B45309"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.cycleReward}
            </text>
            <text x="376" y="180" fill="#78350F" fontSize="10" fontFamily="Inter, sans-serif">
              {t.cycleRewardSub}
            </text>

            {/* Node 4: Release */}
            <rect
              x="26"
              y="138"
              width="172"
              height="56"
              rx="10"
              fill="#ECFDF5"
              stroke="#047857"
              strokeWidth="1.5"
            />
            <text
              x="40"
              y="161"
              fill="#047857"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {t.cycleRelease}
            </text>
            <text x="40" y="180" fill="#065F46" fontSize="10" fontFamily="Inter, sans-serif">
              {t.cycleReleaseSub}
            </text>

            {/* Center concise reminder */}
            <text
              x="280"
              y="112"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="11.5"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              80%+ · 1–5 min
            </text>
          </svg>
        </div>
      )}
    </section>
  );
}
