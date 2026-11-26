import { useRef, useState } from 'react';
import { Check, Copy, Download, Printer, Upload } from 'lucide-react';
import type { DogProfile, DogStage } from '../types/training';
import type { TranslationBundle } from '../data/translations';

interface DogProfileBarProps {
  profile: DogProfile;
  t: TranslationBundle['profile'];
  onChangeProfile: (updated: DogProfile) => void;
  onExportJson: () => void;
  onImportFile: (file: File) => Promise<boolean>;
  onCopyLink: () => Promise<boolean>;
  onPrint: () => void;
}

const STAGES: DogStage[] = ['puppy', 'adolescent', 'adult', 'senior'];

export function DogProfileBar({
  profile,
  t,
  onChangeProfile,
  onExportJson,
  onImportFile,
  onCopyLink,
  onPrint,
}: DogProfileBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [importFeedback, setImportFeedback] = useState<'ok' | 'err' | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await onImportFile(file);
    setImportFeedback(ok ? 'ok' : 'err');
    e.target.value = '';
    window.setTimeout(() => setImportFeedback(null), 3500);
  };

  const handleCopy = async () => {
    const ok = await onCopyLink();
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      aria-label={t.dogNameLabel}
      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 md:p-5 no-print"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        <div className="lg:col-span-3">
          <label
            htmlFor="dog-name-input"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            {t.dogNameLabel}
          </label>
          <input
            id="dog-name-input"
            type="text"
            maxLength={60}
            value={profile.name}
            onChange={(e) => onChangeProfile({ ...profile, name: e.target.value })}
            placeholder={t.dogNamePlaceholder}
            className="w-full min-h-[44px] px-3.5 py-2 text-sm text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857]"
          />
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="dog-stage-select"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            {t.stageLabel}
          </label>
          <select
            id="dog-stage-select"
            value={profile.stage}
            onChange={(e) =>
              onChangeProfile({ ...profile, stage: e.target.value as DogStage })
            }
            className="w-full min-h-[44px] px-3 py-2 text-sm text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] cursor-pointer"
          >
            {STAGES.map((st) => (
              <option key={st} value={st}>
                {t.stages[st]}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="dog-reward-input"
            className="block text-xs font-semibold text-slate-600 mb-1.5"
          >
            {t.favoriteRewardLabel}
          </label>
          <input
            id="dog-reward-input"
            type="text"
            maxLength={100}
            value={profile.favoriteReward}
            onChange={(e) =>
              onChangeProfile({ ...profile, favoriteReward: e.target.value })
            }
            placeholder={t.favoriteRewardPlaceholder}
            className="w-full min-h-[44px] px-3.5 py-2 text-sm text-slate-900 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857]"
          />
        </div>

        <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-end gap-2">
          <button
            type="button"
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
            <span>{t.exportJson}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
            <span>{t.importJson}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
            aria-label={t.importJson}
          />

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
            )}
            <span>{copied ? t.copiedLink : t.copyLink}</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-white bg-[#047857] hover:bg-[#065F46] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.printGuide}</span>
          </button>
        </div>
      </div>

      {importFeedback && (
        <p
          role="status"
          className={`mt-3 text-xs font-medium ${
            importFeedback === 'ok' ? 'text-[#047857]' : 'text-red-700'
          }`}
        >
          {importFeedback === 'ok' ? t.importSuccess : t.importError}
        </p>
      )}
    </section>
  );
}
