import type { LanguageCode, TrainingGoalContent } from '../../types/training';
import { GOAL_ORDER, type LocalizedGoalText } from './meta';
import { GOALS_EN_ES } from './enEs';
import { GOALS_FR_DE_PT } from './frDePt';
import { GOALS_AR_HI_RU } from './arHiRu';
import { GOALS_ZH_JA } from './zhJa';

const LOCALIZED_GOALS_MAP: Record<LanguageCode, Record<string, LocalizedGoalText>> = {
  en: GOALS_EN_ES.en,
  es: GOALS_EN_ES.es,
  fr: GOALS_FR_DE_PT.fr,
  de: GOALS_FR_DE_PT.de,
  pt: GOALS_FR_DE_PT.pt,
  ar: GOALS_AR_HI_RU.ar,
  hi: GOALS_AR_HI_RU.hi,
  ru: GOALS_AR_HI_RU.ru,
  zh: GOALS_ZH_JA.zh,
  ja: GOALS_ZH_JA.ja,
};

export function getGoalsForLanguage(lang: LanguageCode): TrainingGoalContent[] {
  const dict = LOCALIZED_GOALS_MAP[lang] ?? LOCALIZED_GOALS_MAP.en;
  return GOAL_ORDER.map((meta) => {
    const text = dict[meta.id] ?? LOCALIZED_GOALS_MAP.en[meta.id];
    return {
      id: meta.id,
      difficulty: meta.difficulty,
      recommendedMinutes: meta.recommendedMinutes,
      targetCriterionPercent: meta.targetCriterionPercent,
      shortTitle: text.shortTitle,
      title: text.title,
      subtitle: text.subtitle,
      fatigueCheck: text.fatigueCheck,
      commonMistakes: text.commonMistakes,
      steps: text.steps.map((s, idx) => ({
        id: `${meta.id}-step-${idx + 1}`,
        number: idx + 1,
        title: s.title,
        whatToDo: s.whatToDo,
        markAndReward: s.markAndReward,
        criterion: s.criterion,
      })),
    };
  });
}
