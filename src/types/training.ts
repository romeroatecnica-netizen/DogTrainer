export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'ar'
  | 'hi'
  | 'ru'
  | 'zh'
  | 'ja';

export type DogStage = 'puppy' | 'adolescent' | 'adult' | 'senior';

export type TrainingGoalId =
  | 'recall'
  | 'loose-leash'
  | 'leave-drop'
  | 'stay-impulse'
  | 'calm-mat'
  | 'polite-greetings'
  | 'nosework'
  | 'gentle-handling';

export interface DogProfile {
  name: string;
  stage: DogStage;
  favoriteReward: string;
  generalNotes: string;
}

export interface TrainingStep {
  id: string;
  number: number;
  title: string;
  whatToDo: string;
  markAndReward: string;
  criterion: string;
}

export interface TrainingGoalContent {
  id: TrainingGoalId;
  shortTitle: string;
  title: string;
  subtitle: string;
  difficulty: 'beginner' | 'core' | 'intermediate' | 'progressive';
  recommendedMinutes: number;
  targetCriterionPercent: number;
  fatigueCheck: string;
  steps: TrainingStep[];
  commonMistakes: string[];
}

export interface SessionLogEntry {
  id: string;
  createdAt: string;
  goalId: TrainingGoalId;
  dogName: string;
  durationSeconds: number;
  successes: number;
  attempts: number;
  successRate: number;
  bestReward: string;
  distractionNote: string;
}

export interface PawCueStorageState {
  version: 1;
  language?: LanguageCode;
  profile: DogProfile;
  completedSteps: Record<string, boolean>;
  sessions: SessionLogEntry[];
}
