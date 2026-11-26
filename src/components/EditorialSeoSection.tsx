import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TranslationBundle } from '../data/translations';

interface EditorialSeoSectionProps {
  t: TranslationBundle['editorial'];
}

export function EditorialSeoSection({ t }: EditorialSeoSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div id="guide" className="no-print space-y-8">
      {/* Core Method Guide */}
      <section
        aria-label={t.sectionTitle}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8"
      >
        <div className="max-w-3xl mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display text-balance">
            {t.sectionTitle}
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.blocks.map((block, idx) => (
            <article
              key={idx}
              className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5"
            >
              <h3 className="text-base font-bold text-slate-900 font-display">
                {String(idx + 1).padStart(2, '0')}. {block.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">{block.body}</p>
              <ul className="mt-3 space-y-1.5 text-xs md:text-sm text-slate-600 list-disc ps-4 leading-relaxed">
                {block.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Canine Fatigue & Stress Signals Matrix */}
      <section
        aria-label={t.fatigueTitle}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8"
      >
        <div className="max-w-3xl mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display">
            {t.fatigueTitle}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            {t.fatigueSubtitle}
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4 text-start">{t.fatigueHeaders.signal}</th>
                <th className="py-3 px-4 text-start">{t.fatigueHeaders.meaning}</th>
                <th className="py-3 px-4 text-start">{t.fatigueHeaders.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {t.fatigueSignals.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 align-top">
                    {row.signal}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 align-top">{row.meaning}</td>
                  <td className="py-3.5 px-4 text-[#047857] font-medium align-top">
                    {row.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section
        id="faq"
        aria-label={t.faqTitle}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-display mb-5">
          {t.faqTitle}
        </h2>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
          {t.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-white">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start min-h-[52px] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm md:text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-[#047857]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transparent local-execution & veterinary notice */}
        <p className="mt-6 text-xs md:text-sm text-slate-600 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3.5 leading-relaxed">
          {t.transparentNotice}
        </p>
      </section>
    </div>
  );
}
