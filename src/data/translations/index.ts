import type { LanguageCode } from '../../types/training';
import type { TranslationBundle } from './types';
import { WEST_TRANSLATIONS } from './west';
import { EAST_TRANSLATIONS } from './east';

const ALL_TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  ...WEST_TRANSLATIONS,
  ...EAST_TRANSLATIONS,
};

export function getTranslations(lang: LanguageCode): TranslationBundle {
  return ALL_TRANSLATIONS[lang] ?? ALL_TRANSLATIONS.en;
}

export type { TranslationBundle } from './types';
