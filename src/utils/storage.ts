import type { PawCueStorageState } from '../types/training';
import { VALID_LANG_CODES } from '../config/seo';

const STORAGE_KEY = 'pawcue_trainer_state_v1';

export const DEFAULT_STORAGE_STATE: PawCueStorageState = {
  version: 1,
  profile: {
    name: '',
    stage: 'adult',
    favoriteReward: '',
    generalNotes: '',
  },
  completedSteps: {},
  sessions: [],
};

export function loadStorageState(): PawCueStorageState {
  if (typeof window === 'undefined') return DEFAULT_STORAGE_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE_STATE;
    const parsed = JSON.parse(raw) as Partial<PawCueStorageState>;
    return {
      version: 1,
      language:
        parsed.language && VALID_LANG_CODES.has(parsed.language)
          ? parsed.language
          : undefined,
      profile: {
        name: typeof parsed.profile?.name === 'string' ? parsed.profile.name : '',
        stage:
          parsed.profile?.stage === 'puppy' ||
          parsed.profile?.stage === 'adolescent' ||
          parsed.profile?.stage === 'adult' ||
          parsed.profile?.stage === 'senior'
            ? parsed.profile.stage
            : 'adult',
        favoriteReward:
          typeof parsed.profile?.favoriteReward === 'string'
            ? parsed.profile.favoriteReward
            : '',
        generalNotes:
          typeof parsed.profile?.generalNotes === 'string'
            ? parsed.profile.generalNotes
            : '',
      },
      completedSteps:
        parsed.completedSteps && typeof parsed.completedSteps === 'object'
          ? parsed.completedSteps
          : {},
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions.slice(0, 100) : [],
    };
  } catch {
    return DEFAULT_STORAGE_STATE;
  }
}

export function saveStorageState(state: PawCueStorageState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors in restricted browsing modes
  }
}

export function validateImportedState(raw: unknown): PawCueStorageState | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<PawCueStorageState>;
  if (candidate.version !== 1 || !candidate.profile || typeof candidate.profile !== 'object') {
    return null;
  }
  const stage = candidate.profile.stage;
  const validStage =
    stage === 'puppy' || stage === 'adolescent' || stage === 'adult' || stage === 'senior'
      ? stage
      : 'adult';

  return {
    version: 1,
    language:
      candidate.language && VALID_LANG_CODES.has(candidate.language)
        ? candidate.language
        : undefined,
    profile: {
      name: typeof candidate.profile.name === 'string' ? candidate.profile.name.slice(0, 60) : '',
      stage: validStage,
      favoriteReward:
        typeof candidate.profile.favoriteReward === 'string'
          ? candidate.profile.favoriteReward.slice(0, 120)
          : '',
      generalNotes:
        typeof candidate.profile.generalNotes === 'string'
          ? candidate.profile.generalNotes.slice(0, 500)
          : '',
    },
    completedSteps:
      candidate.completedSteps && typeof candidate.completedSteps === 'object'
        ? Object.fromEntries(
            Object.entries(candidate.completedSteps).filter(
              ([k, v]) => typeof k === 'string' && typeof v === 'boolean'
            )
          )
        : {},
    sessions: Array.isArray(candidate.sessions)
      ? candidate.sessions
          .filter(
            (s) =>
              s &&
              typeof s === 'object' &&
              typeof s.id === 'string' &&
              typeof s.createdAt === 'string' &&
              typeof s.goalId === 'string' &&
              typeof s.successes === 'number' &&
              typeof s.attempts === 'number'
          )
          .slice(0, 100)
      : [],
  };
}
