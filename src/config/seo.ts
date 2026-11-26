import type { LanguageCode, TrainingGoalContent } from '../types/training';

export const CANONICAL_ORIGIN = 'https://pawcue.bastelar.com';

export interface LanguageMeta {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', dir: 'ltr', hreflang: 'en' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', dir: 'ltr', hreflang: 'es' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', dir: 'ltr', hreflang: 'fr' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', dir: 'ltr', hreflang: 'de' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', dir: 'ltr', hreflang: 'pt' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', dir: 'rtl', hreflang: 'ar' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', dir: 'ltr', hreflang: 'hi' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', dir: 'ltr', hreflang: 'ru' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', dir: 'ltr', hreflang: 'zh' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', dir: 'ltr', hreflang: 'ja' },
];

export const VALID_LANG_CODES = new Set<LanguageCode>(
  SUPPORTED_LANGUAGES.map((l) => l.code)
);

export function getLanguageMeta(lang: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];
}

export function getCanonicalUrl(lang: LanguageCode): string {
  if (lang === 'en') {
    return `${CANONICAL_ORIGIN}/`;
  }
  return `${CANONICAL_ORIGIN}/?lang=${lang}`;
}

export function detectInitialLanguage(storedLang?: LanguageCode): LanguageCode {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang')?.toLowerCase() as LanguageCode | undefined;
    if (paramLang && VALID_LANG_CODES.has(paramLang)) {
      return paramLang;
    }
    if (storedLang && VALID_LANG_CODES.has(storedLang)) {
      return storedLang;
    }
    const navLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of navLangs) {
      const base = raw?.toLowerCase().split('-')[0] as LanguageCode | undefined;
      if (base && VALID_LANG_CODES.has(base)) {
        return base;
      }
    }
  }
  return 'en';
}

export interface SeoUpdatePayload {
  lang: LanguageCode;
  title: string;
  description: string;
  appName: string;
  activeGoal: TrainingGoalContent;
  faqs: Array<{ question: string; answer: string }>;
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLinkTag(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) {
      el.setAttribute('hreflang', hreflang);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applySeoMetadata(payload: SeoUpdatePayload): void {
  if (typeof document === 'undefined') return;

  const meta = getLanguageMeta(payload.lang);
  const canonicalUrl = getCanonicalUrl(payload.lang);

  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
  document.title = payload.title;

  upsertMetaTag('name', 'description', payload.description);
  upsertMetaTag('property', 'og:title', payload.title);
  upsertMetaTag('property', 'og:description', payload.description);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('name', 'twitter:title', payload.title);
  upsertMetaTag('name', 'twitter:description', payload.description);

  // Strictly use CANONICAL_ORIGIN, never window.location.origin
  upsertLinkTag('canonical', canonicalUrl);
  for (const l of SUPPORTED_LANGUAGES) {
    upsertLinkTag('alternate', getCanonicalUrl(l.code), l.hreflang);
  }
  upsertLinkTag('alternate', `${CANONICAL_ORIGIN}/`, 'x-default');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: payload.appName,
        url: canonicalUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        inLanguage: meta.code,
        isAccessibleForFree: true,
        description: payload.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: payload.activeGoal.title,
        description: payload.activeGoal.subtitle,
        inLanguage: meta.code,
        totalTime: `PT${payload.activeGoal.recommendedMinutes}M`,
        step: payload.activeGoal.steps.map((step) => ({
          '@type': 'HowToStep',
          position: step.number,
          name: step.title,
          text: `${step.whatToDo} ${step.markAndReward} ${step.criterion}`,
          url: `${canonicalUrl}#step-${step.id}`,
        })),
      },
      {
        '@type': 'FAQPage',
        inLanguage: meta.code,
        mainEntity: payload.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  let scriptEl = document.getElementById('pawcue-jsonld') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'pawcue-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(jsonLd);
}
