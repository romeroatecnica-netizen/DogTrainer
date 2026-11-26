import type { DogStage } from '../../types/training';

export interface GearItem {
  id: string;
  category: string;
  title: string;
  whyItHelps: string;
  ctaLabel: string;
  href: string;
}

export interface EditorialSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface FatigueSignal {
  signal: string;
  meaning: string;
  action: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TranslationBundle {
  seoTitle: string;
  seoDescription: string;
  appName: string;
  nav: {
    trainer: string;
    session: string;
    guide: string;
    faq: string;
    languageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  profile: {
    dogNameLabel: string;
    dogNamePlaceholder: string;
    stageLabel: string;
    stages: Record<DogStage, string>;
    favoriteRewardLabel: string;
    favoriteRewardPlaceholder: string;
    exportJson: string;
    importJson: string;
    copyLink: string;
    copiedLink: string;
    printGuide: string;
    importSuccess: string;
    importError: string;
  };
  goals: {
    sectionTitle: string;
    difficultyLabels: {
      beginner: string;
      core: string;
      intermediate: string;
      progressive: string;
    };
    recommendedBatch: string;
    minutesUnit: string;
    progressLabel: string;
    stepsCompleted: string;
    whatToDoLabel: string;
    markRewardLabel: string;
    criterionLabel: string;
    markStepDone: string;
    stepDone: string;
    commonMistakesTitle: string;
    fatigueCheckTitle: string;
    resetGoalProgress: string;
  };
  svg: {
    cardTitle: string;
    modeLadder: string;
    modeCycle: string;
    ladderTitle: string;
    stage1Title: string;
    stage1Sub: string;
    stage2Title: string;
    stage2Sub: string;
    stage3Title: string;
    stage3Sub: string;
    rule3Ds: string;
    cycleTitle: string;
    cycleCue: string;
    cycleCueSub: string;
    cycleAction: string;
    cycleActionSub: string;
    cycleReward: string;
    cycleRewardSub: string;
    cycleRelease: string;
    cycleReleaseSub: string;
  };
  timer: {
    title: string;
    presetsLabel: string;
    minSuffix: string;
    start: string;
    pause: string;
    reset: string;
    soundOn: string;
    soundOff: string;
    completedBanner: string;
    repCounterTitle: string;
    plusSuccess: string;
    plusAttempt: string;
    undo: string;
    resetReps: string;
    successRateLabel: string;
    criterionMet: string;
    keepPracticing: string;
    bestRewardLabel: string;
    bestRewardPlaceholder: string;
    distractionNoteLabel: string;
    distractionNotePlaceholder: string;
    saveSession: string;
    savedFeedback: string;
  };
  history: {
    title: string;
    empty: string;
    clearAll: string;
    deleteEntry: string;
    repsSummary: string;
    durationSummary: string;
  };
  mobileBar: {
    steps: string;
    timer: string;
    quickSuccess: string;
  };
  ads: {
    sponsoredLabel: string;
    slotMidHint: string;
    slotBottomHint: string;
  };
  gear: {
    sectionTitle: string;
    sectionSubtitle: string;
    disclosure: string;
    items: GearItem[];
  };
  editorial: {
    sectionTitle: string;
    sectionSubtitle: string;
    blocks: EditorialSection[];
    fatigueTitle: string;
    fatigueSubtitle: string;
    fatigueHeaders: {
      signal: string;
      meaning: string;
      action: string;
    };
    fatigueSignals: FatigueSignal[];
    faqTitle: string;
    faqs: FaqItem[];
    transparentNotice: string;
  };
  print: {
    sheetTitle: string;
    dogLabel: string;
    stageLabel: string;
    rewardLabel: string;
    generatedOn: string;
    notesBoxTitle: string;
  };
  footer: {
    brandLine: string;
    canonicalNote: string;
  };
}
