import { ExternalLink } from 'lucide-react';
import type { TranslationBundle } from '../data/translations';

interface GearAffiliateSectionProps {
  t: TranslationBundle['gear'];
}

export function GearAffiliateSection({ t }: GearAffiliateSectionProps) {
  return (
    <section
      aria-label={t.sectionTitle}
      className="no-print bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
            {t.sectionTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">{t.sectionSubtitle}</p>
        </div>
        <span className="text-xs text-slate-500">{t.disclosure}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {t.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between bg-[#F8FAFC] border border-slate-200 rounded-xl p-4"
          >
            <div>
              <div className="text-xs font-semibold text-[#0F766E] mb-1.5">
                {item.category}
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {item.whyItHelps}
              </p>
            </div>

            <a
              href={item.href}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="mt-4 inline-flex items-center justify-between gap-2 min-h-[40px] px-3 py-2 text-xs font-semibold text-[#047857] bg-white hover:bg-emerald-50 border border-slate-200 hover:border-[#047857] rounded-lg transition-colors"
            >
              <span>{item.ctaLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
