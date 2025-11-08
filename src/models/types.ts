// ============================================
// LESSON & CONTENT TYPES
// ============================================

export interface Lesson {
    id: string;
    title: string;
    titleFy: string;
    description: string;
    descriptionFy: string;
    level: LanguageLevel;
    order: number;
    topic: string;
    estimatedMinutes: number;
    xpReward: number;
    prerequisiteLessons: string[];
    tags: string[];
    content: LessonContent[];
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonContent =
    | IntroContent
    | VocabularyContent
    | GrammarContent
    | ExerciseBlockContent
    | SummaryContent;

export interface IntroContent {
    type: 'intro';
    data: {
        text: string;
        textFy: string;
    };
}

export interface VocabularyContent {
    type: 'vocabulary';
    data: {
        title: string;
        words: VocabularyWord[];
    };
}

export interface VocabularyWord {
    fy: string;
    nl: string;
    pronunciation: string;
    audioUrl?: string;
}

export interface GrammarContent {
    type: 'grammar';
    data: {
        title: string;
        explanation: string;
        examples?: GrammarExample[];
        tips?: string[];
        conjugationTable?: ConjugationTable;
    };
}

export interface GrammarExample {
    fy: string;
    nl: string;
    explanation: string;
}

export interface ConjugationTable {
    verb: string;
    translation: string;
    conjugations: Conjugation[];
}

export interface Conjugation {
    pronoun: string;
    form: string;
    translation: string;
}

export interface ExerciseBlockContent {
    type: 'exercise_block';
    data: {
        exerciseIds: string[];
    };
}

export interface SummaryContent {
    type: 'summary';
    data: {
        title: string;
        points: string[];
    };
}

// ============================================
// EXERCISE TYPES
// ============================================

export type Exercise =
    | MultipleChoiceExercise
    | FillBlankExercise
    | FillBlankMultipleExercise
    | WordOrderExercise
    | ConjugationExercise
    | MatchPairsExercise
    | TranslationExercise;

export interface BaseExercise {
    id: string;
    lessonId: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    xpReward: number;
    explanation: string;
    hint?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
    type: 'multiple_choice';
    question: string;
    questionFy?: string;
    options: MultipleChoiceOption[];
}

export interface MultipleChoiceOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface FillBlankExercise extends BaseExercise {
    type: 'fill_blank';
    question: string;
    questionFy?: string;
    correctAnswers: string[];
    caseSensitive: boolean;
}

export interface FillBlankMultipleExercise extends BaseExercise {
    type: 'fill_blank_multiple';
    sentence: string;
    sentenceFy?: string;
    blanks: BlankField[];
}

export interface BlankField {
    index: number;
    correctAnswers: string[];
    hint?: string;
}

export interface WordOrderExercise extends BaseExercise {
    type: 'word_order';
    question: string;
    words: string[];
    correctOrder: string[];
    translation: string;
}

export interface ConjugationExercise extends BaseExercise {
    type: 'conjugation';
    verb: string;
    translation: string;
    questions: ConjugationQuestion[];
}

export interface ConjugationQuestion {
    pronoun: string;
    correctAnswer: string;
    hint?: string;
}

export interface MatchPairsExercise extends BaseExercise {
    type: 'match_pairs';
    question: string;
    pairs: MatchPair[];
}

export interface MatchPair {
    id: string;
    left: string;
    right: string;
}

export interface TranslationExercise extends BaseExercise {
    type: 'translation';
    question: string;
    correctAnswers: string[];
    alternativeAnswers?: string[];
}

// ============================================
// TOPIC TYPES
// ============================================

export interface Topic {
    id: string;
    name: string;
    nameFy: string;
    description: string;
    icon: string;
    color: string;
    order: number;
}

// ============================================
// USER & PROGRESS TYPES
// ============================================

export interface UserProfile {
    email: string;
    displayName: string;
    createdAt: Date;
    lastActive: Date;
    nativeLanguage: string;
    targetLanguage: string;
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalLessonsCompleted: number;
    totalExercisesCompleted: number;
}

export interface LessonProgress {
    status: 'not_started' | 'in_progress' | 'completed';
    completedAt?: Date;
    score?: number;
    starsEarned?: number;
    attempts: number;
    firstAttemptAt?: Date;
    lastAttemptAt?: Date;
    timeSpentSeconds: number;
    xpEarned: number;
}

export interface ExerciseProgress {
    timesAttempted: number;
    timesCorrect: number;
    timesIncorrect: number;
    firstAttemptAt: Date;
    lastAttemptAt: Date;

    // Spaced Repetition
    easeFactor: number;
    interval: number;
    nextReviewDate: Date;
    reviewCount: number;

    // Performance
    averageTimeSeconds: number;
    fastestTimeSeconds: number;
    currentStreak: number;
    longestStreak: number;
}

export interface TopicProgress {
    masteryLevel: number; // 0-1
    exercisesCompleted: number;
    exercisesTotal: number;
    averageScore: number;
    lastPracticedAt: Date;
    weakExercises: string[];
    strongExercises: string[];
    weakPoints?: string[];
    strongPoints?: string[];
}

export interface DailyActivity {
    date: string; // YYYY-MM-DD
    xpEarned: number;
    exercisesCompleted: number;
    timeSpentSeconds: number;
    lessonsCompleted: number;
    practiceSessionsCount: number;
}

export interface UserSettings {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    dailyGoalXP: number;
    dailyReminderTime: string;
    showTranslations: boolean;
    showHints: boolean;
    theme: 'light' | 'dark' | 'auto';
}

// ============================================
// ACHIEVEMENT TYPES
// ============================================

export interface Achievement {
    id: string;
    name: string;
    nameFy: string;
    description: string;
    icon: string;
    xpReward: number;
    category: 'milestone' | 'streak' | 'performance' | 'mastery' | 'speed';
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    requirement?: AchievementRequirement;
}

export type AchievementRequirement =
    | { type: 'streak'; value: number }
    | { type: 'topic_mastery'; topic: string; level: LanguageLevel; masteryThreshold: number }
    | { type: 'exercise_count'; value: number }
    | { type: 'lesson_count'; value: number }
    | { type: 'xp_total'; value: number };

export interface UserAchievement {
    id: string;
    unlockedAt: Date;
    seen: boolean;
}

// ============================================
// LEVEL TYPES
// ============================================

export interface Level {
    level: number;
    minXP: number;
    maxXP: number;
    title: string;
    titleFy: string;
}

// ============================================
// EXERCISE ATTEMPT TYPES (for tracking)
// ============================================

export interface ExerciseAttempt {
    exerciseId: string;
    userId: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
    attemptedAt: Date;
    userAnswer?: string | string[];
    hintsUsed: number;
}

// ============================================
// ANALYTICS & REPORTING TYPES
// ============================================

export interface UserStatistics {
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    lessonsCompleted: number;
    exercisesCompleted: number;
    averageScore: number;
    totalTimeSpentSeconds: number;
    topicProgress: Record<string, TopicProgress>;
    recentActivity: DailyActivity[];
    weeklyXP: number;
    monthlyXP: number;
}

export interface WeakArea {
    topic: string;
    topicName: string;
    masteryLevel: number;
    exercisesFailed: string[];
    recommendedExercises: string[];
}

export interface LearningReport {
    userId: string;
    generatedAt: Date;
    period: 'week' | 'month' | 'all_time';
    statistics: UserStatistics;
    strongAreas: TopicProgress[];
    weakAreas: WeakArea[];
    recommendations: string[];
    nextMilestone: {
        type: 'level' | 'achievement' | 'topic_mastery';
        target: string;
        progress: number; // 0-1
    };
}