import type { TrainingGoalId } from '../../types/training';

export interface GoalBaseMeta {
  id: TrainingGoalId;
  difficulty: 'beginner' | 'core' | 'intermediate' | 'progressive';
  recommendedMinutes: number;
  targetCriterionPercent: number;
}

export const GOAL_ORDER: GoalBaseMeta[] = [
  { id: 'recall', difficulty: 'core', recommendedMinutes: 3, targetCriterionPercent: 80 },
  { id: 'loose-leash', difficulty: 'intermediate', recommendedMinutes: 5, targetCriterionPercent: 80 },
  { id: 'leave-drop', difficulty: 'core', recommendedMinutes: 3, targetCriterionPercent: 80 },
  { id: 'stay-impulse', difficulty: 'intermediate', recommendedMinutes: 3, targetCriterionPercent: 80 },
  { id: 'calm-mat', difficulty: 'progressive', recommendedMinutes: 5, targetCriterionPercent: 80 },
  { id: 'polite-greetings', difficulty: 'intermediate', recommendedMinutes: 3, targetCriterionPercent: 80 },
  { id: 'nosework', difficulty: 'beginner', recommendedMinutes: 5, targetCriterionPercent: 80 },
  { id: 'gentle-handling', difficulty: 'beginner', recommendedMinutes: 2, targetCriterionPercent: 80 },
];

export interface LocalizedGoalText {
  shortTitle: string;
  title: string;
  subtitle: string;
  fatigueCheck: string;
  steps: Array<{
    title: string;
    whatToDo: string;
    markAndReward: string;
    criterion: string;
  }>;
  commonMistakes: string[];
}
