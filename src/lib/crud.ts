import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import type {
    Achievement,
    DailyActivity,
    Exercise,
    ExerciseProgress,
    Lesson,
    LessonProgress,
    TopicProgress,
    UserAchievement,
    UserProfile
} from '../models/types.ts';
import {db} from './firebase.ts';

// ============================================
// LESSON FUNCTIONS
// ============================================

export async function getLesson(lessonId: string): Promise<Lesson | null> {
    try {
        const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
        if (!lessonDoc.exists()) return null;

        return {id: lessonDoc.id, ...lessonDoc.data()} as Lesson;
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return null;
    }
}

export async function getAllLessons(): Promise<Lesson[]> {
    try {
        const lessonsQuery = query(
            collection(db, 'lessons'),
            orderBy('order', 'asc')
        );
        const snapshot = await getDocs(lessonsQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lesson[];
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return [];
    }
}

export async function getLessonsByTopic(topic: string): Promise<Lesson[]> {
    try {
        const lessonsQuery = query(
            collection(db, 'lessons'),
            where('topic', '==', topic),
            orderBy('order', 'asc')
        );
        const snapshot = await getDocs(lessonsQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lesson[];
    } catch (error) {
        console.error('Error fetching lessons by topic:', error);
        return [];
    }
}

export async function getLessonsByLevel(level: string): Promise<Lesson[]> {
    try {
        const lessonsQuery = query(
            collection(db, 'lessons'),
            where('level', '==', level),
            orderBy('order', 'asc')
        );
        const snapshot = await getDocs(lessonsQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lesson[];
    } catch (error) {
        console.error('Error fetching lessons by level:', error);
        return [];
    }
}

// ============================================
// EXERCISE FUNCTIONS
// ============================================

export async function getExercise(exerciseId: string): Promise<Exercise | null> {
    try {
        const exerciseDoc = await getDoc(doc(db, 'exercises', exerciseId));
        if (!exerciseDoc.exists()) return null;

        return {id: exerciseDoc.id, ...exerciseDoc.data()} as Exercise;
    } catch (error) {
        console.error('Error fetching exercise:', error);
        return null;
    }
}

export async function getExercisesByIds(exerciseIds: string[]): Promise<Exercise[]> {
    try {
        const exercises = await Promise.all(
            exerciseIds.map(id => getExercise(id))
        );

        return exercises.filter(ex => ex !== null) as Exercise[];
    } catch (error) {
        console.error('Error fetching exercises by IDs:', error);
        return [];
    }
}

export async function getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
    try {
        const exercisesQuery = query(
            collection(db, 'exercises'),
            where('lessonId', '==', lessonId)
        );
        const snapshot = await getDocs(exercisesQuery);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Exercise[];
    } catch (error) {
        console.error('Error fetching exercises by lesson:', error);
        return [];
    }
}

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId, 'data', 'profile'));
        if (!userDoc.exists()) return null;

        const data = userDoc.data();
        return {
            ...data,
            createdAt: data.createdAt?.toDate(),
            lastActive: data.lastActive?.toDate()
        } as UserProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export async function createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
        await setDoc(doc(db, 'users', userId, 'data', 'profile'), {
            ...profile,
            createdAt: Timestamp.now(),
            lastActive: Timestamp.now(),
            totalXP: 0,
            currentLevel: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalLessonsCompleted: 0,
            totalExercisesCompleted: 0
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
        await updateDoc(doc(db, 'users', userId, 'data', 'profile'), {
            ...updates,
            lastActive: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

// ============================================
// LESSON PROGRESS FUNCTIONS
// ============================================

export async function getLessonProgress(
    userId: string,
    lessonId: string
): Promise<LessonProgress | null> {
    try {
        const progressDoc = await getDoc(
            doc(db, 'users', userId, 'progress', 'lessons', 'data', lessonId)
        );

        if (!progressDoc.exists()) return null;

        const data = progressDoc.data();
        return {
            ...data,
            completedAt: data.completedAt?.toDate(),
            firstAttemptAt: data.firstAttemptAt?.toDate(),
            lastAttemptAt: data.lastAttemptAt?.toDate()
        } as LessonProgress;
    } catch (error) {
        console.error('Error fetching lesson progress:', error);
        return null;
    }
}

export async function updateLessonProgress(
    userId: string,
    lessonId: string,
    progress: Partial<LessonProgress>
): Promise<void> {
    try {
        const progressRef = doc(db, 'users', userId, 'progress', 'lessons', 'data', lessonId);
        const existing = await getDoc(progressRef);

        const updateData = {
            ...progress,
            lastAttemptAt: Timestamp.now()
        };

        if (!existing.exists()) {
            // First attempt
            await setDoc(progressRef, {
                ...updateData,
                firstAttemptAt: Timestamp.now(),
                attempts: 1,
                timeSpentSeconds: 0,
                xpEarned: 0,
                status: 'in_progress'
            });
        } else {
            // Update existing
            await updateDoc(progressRef, {
                ...updateData,
                attempts: existing.data().attempts + 1
            });
        }
    } catch (error) {
        console.error('Error updating lesson progress:', error);
        throw error;
    }
}

export async function completeLessonProgress(
    userId: string,
    lessonId: string,
    score: number,
    timeSpent: number,
    xpEarned: number
): Promise<void> {
    try {
        const stars = calculateStars(score);

        await updateLessonProgress(userId, lessonId, {
            status: 'completed',
            completedAt: new Date(),
            score,
            starsEarned: stars,
            timeSpentSeconds: timeSpent,
            xpEarned
        });

        // Update user profile
        const profile = await getUserProfile(userId);
        if (profile) {
            await updateUserProfile(userId, {
                totalXP: profile.totalXP + xpEarned,
                totalLessonsCompleted: profile.totalLessonsCompleted + 1,
                currentLevel: calculateLevel(profile.totalXP + xpEarned)
            });
        }

        // Update daily activity
        await updateDailyActivity(userId, {
            lessonsCompleted: 1,
            xpEarned,
            timeSpentSeconds: timeSpent
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        throw error;
    }
}

function calculateStars(score: number): number {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 50) return 1;
    return 0;
}

function calculateLevel(totalXP: number): number {
    // Simple level calculation - customize based on your levels.json
    const levels = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 6000];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (totalXP >= levels[i]) return i + 1;
    }
    return 1;
}

// ============================================
// EXERCISE PROGRESS FUNCTIONS
// ============================================

export async function getExerciseProgress(
    userId: string,
    exerciseId: string
): Promise<ExerciseProgress | null> {
    try {
        const progressDoc = await getDoc(
            doc(db, 'users', userId, 'progress', 'exercises', 'data', exerciseId)
        );

        if (!progressDoc.exists()) return null;

        const data = progressDoc.data();
        return {
            ...data,
            firstAttemptAt: data.firstAttemptAt?.toDate(),
            lastAttemptAt: data.lastAttemptAt?.toDate(),
            nextReviewDate: data.nextReviewDate?.toDate()
        } as ExerciseProgress;
    } catch (error) {
        console.error('Error fetching exercise progress:', error);
        return null;
    }
}

export async function recordExerciseAttempt(
    userId: string,
    exerciseId: string,
    isCorrect: boolean,
    timeSpentSeconds: number,
    _hintsUsed: number = 0
): Promise<void> {
    try {

        void _hintsUsed;

        const progressRef = doc(db, 'users', userId, 'progress', 'exercises', 'data', exerciseId);
        const existing = await getDoc(progressRef);

        if (!existing.exists()) {
            // First attempt
            const initialData: ExerciseProgress = {
                timesAttempted: 1,
                timesCorrect: isCorrect ? 1 : 0,
                timesIncorrect: isCorrect ? 0 : 1,
                firstAttemptAt: new Date(),
                lastAttemptAt: new Date(),
                easeFactor: 2.5,
                interval: isCorrect ? 1 : 0,
                nextReviewDate: calculateNextReview(1, isCorrect),
                reviewCount: 0,
                averageTimeSeconds: timeSpentSeconds,
                fastestTimeSeconds: timeSpentSeconds,
                currentStreak: isCorrect ? 1 : 0,
                longestStreak: isCorrect ? 1 : 0
            };

            await setDoc(progressRef, {
                ...initialData,
                firstAttemptAt: Timestamp.fromDate(initialData.firstAttemptAt),
                lastAttemptAt: Timestamp.fromDate(initialData.lastAttemptAt),
                nextReviewDate: Timestamp.fromDate(initialData.nextReviewDate)
            });
        } else {
            // Update existing
            const data = existing.data() as ExerciseProgress;
            const newAttempts = data.timesAttempted + 1;
            const newCorrect = data.timesCorrect + (isCorrect ? 1 : 0);
            const newIncorrect = data.timesIncorrect + (isCorrect ? 0 : 1);
            const newStreak = isCorrect ? data.currentStreak + 1 : 0;

            // Spaced repetition calculation
            const {newInterval, newEaseFactor} = calculateSpacedRepetition(
                data.easeFactor,
                data.interval,
                isCorrect
            );

            await updateDoc(progressRef, {
                timesAttempted: newAttempts,
                timesCorrect: newCorrect,
                timesIncorrect: newIncorrect,
                lastAttemptAt: Timestamp.now(),
                easeFactor: newEaseFactor,
                interval: newInterval,
                nextReviewDate: Timestamp.fromDate(calculateNextReview(newInterval, isCorrect)),
                reviewCount: data.reviewCount + 1,
                averageTimeSeconds: ((data.averageTimeSeconds * data.timesAttempted) + timeSpentSeconds) / newAttempts,
                fastestTimeSeconds: Math.min(data.fastestTimeSeconds, timeSpentSeconds),
                currentStreak: newStreak,
                longestStreak: Math.max(data.longestStreak, newStreak)
            });
        }

        // Update user stats
        const profile = await getUserProfile(userId);
        if (profile) {
            await updateUserProfile(userId, {
                totalExercisesCompleted: profile.totalExercisesCompleted + 1
            });
        }

        // Record daily activity
        await updateDailyActivity(userId, {exercisesCompleted: 1, timeSpentSeconds});

    } catch (error) {
        console.error('Error recording exercise attempt:', error);
        throw error;
    }
}

function calculateSpacedRepetition(
    currentEase: number,
    currentInterval: number,
    isCorrect: boolean
): { newInterval: number; newEaseFactor: number } {
    if (!isCorrect) {
        return {
            newInterval: 1, // Reset to 1 day
            newEaseFactor: Math.max(1.3, currentEase - 0.2) // Decrease ease but not below 1.3
        };
    }

    return {
        newInterval: Math.round(currentInterval * currentEase),
        newEaseFactor: Math.min(2.5, currentEase + 0.1) // Increase ease but not above 2.5
    };
}

function calculateNextReview(interval: number, isCorrect: boolean): Date {
    if (!isCorrect) {
        // Review again tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
}

// ============================================
// EXERCISES DUE FOR REVIEW
// ============================================

export async function getExercisesForReview(
    userId: string,
    currentDate: Date = new Date()
): Promise<string[]> {
    try {
        const progressQuery = query(
            collection(db, 'users', userId, 'progress', 'exercises', 'data'),
            where('nextReviewDate', '<=', Timestamp.fromDate(currentDate)),
            orderBy('nextReviewDate', 'asc'),
            limit(20) // Limit to 20 exercises per review session
        );

        const snapshot = await getDocs(progressQuery);
        return snapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error('Error fetching exercises for review:', error);
        return [];
    }
}

// ============================================
// TOPIC PROGRESS FUNCTIONS
// ============================================

export async function getTopicProgress(
    userId: string,
    topicId: string
): Promise<TopicProgress | null> {
    try {
        const progressDoc = await getDoc(
            doc(db, 'users', userId, 'progress', 'topics', 'data', topicId)
        );

        if (!progressDoc.exists()) return null;

        const data = progressDoc.data();
        return {
            ...data,
            lastPracticedAt: data.lastPracticedAt?.toDate()
        } as TopicProgress;
    } catch (error) {
        console.error('Error fetching topic progress:', error);
        return null;
    }
}

export async function updateTopicProgress(
    userId: string,
    topicId: string,
    exerciseId: string,
    score: number
): Promise<void> {
    try {
        const progressRef = doc(db, 'users', userId, 'progress', 'topics', 'data', topicId);
        const existing = await getDoc(progressRef);

        if (!existing.exists()) {
            // Initialize topic progress
            await setDoc(progressRef, {
                masteryLevel: score / 100,
                exercisesCompleted: 1,
                exercisesTotal: 10, // This should come from the topic definition
                averageScore: score,
                lastPracticedAt: Timestamp.now(),
                weakExercises: score < 70 ? [exerciseId] : [],
                strongExercises: score >= 90 ? [exerciseId] : []
            });
        } else {
            const data = existing.data();
            const newCompleted = data.exercisesCompleted + 1;
            const newAverage = ((data.averageScore * data.exercisesCompleted) + score) / newCompleted;
            const newMastery = Math.min(1.0, newAverage / 100);

            // Update weak/strong exercises
            const weakExercises = [...data.weakExercises];
            const strongExercises = [...data.strongExercises];

            if (score < 70 && !weakExercises.includes(exerciseId)) {
                weakExercises.push(exerciseId);
            } else if (score >= 70) {
                const index = weakExercises.indexOf(exerciseId);
                if (index > -1) weakExercises.splice(index, 1);
            }

            if (score >= 90 && !strongExercises.includes(exerciseId)) {
                strongExercises.push(exerciseId);
            }

            await updateDoc(progressRef, {
                masteryLevel: newMastery,
                exercisesCompleted: newCompleted,
                averageScore: newAverage,
                lastPracticedAt: Timestamp.now(),
                weakExercises,
                strongExercises
            });
        }
    } catch (error) {
        console.error('Error updating topic progress:', error);
        throw error;
    }
}

// ============================================
// DAILY ACTIVITY FUNCTIONS
// ============================================

export async function updateDailyActivity(
    userId: string,
    activity: Partial<DailyActivity>
): Promise<void> {
    try {
        const today = new Date().toISOString().split('T')[0];
        const activityRef = doc(db, 'users', userId, 'activity', today);
        const existing = await getDoc(activityRef);

        if (!existing.exists()) {
            await setDoc(activityRef, {
                date: today,
                xpEarned: activity.xpEarned || 0,
                exercisesCompleted: activity.exercisesCompleted || 0,
                timeSpentSeconds: activity.timeSpentSeconds || 0,
                lessonsCompleted: activity.lessonsCompleted || 0,
                practiceSessionsCount: 1
            });
        } else {
            const data = existing.data();
            await updateDoc(activityRef, {
                xpEarned: data.xpEarned + (activity.xpEarned || 0),
                exercisesCompleted: data.exercisesCompleted + (activity.exercisesCompleted || 0),
                timeSpentSeconds: data.timeSpentSeconds + (activity.timeSpentSeconds || 0),
                lessonsCompleted: data.lessonsCompleted + (activity.lessonsCompleted || 0)
            });
        }

        // Update streak
        await updateStreak(userId);
    } catch (error) {
        console.error('Error updating daily activity:', error);
        throw error;
    }
}

async function updateStreak(userId: string): Promise<void> {
    try {
        const profile = await getUserProfile(userId);
        if (!profile) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const yesterdayActivity = await getDoc(doc(db, 'users', userId, 'activity', yesterdayStr));

        if (yesterdayActivity.exists()) {
            // Continue streak
            await updateUserProfile(userId, {
                currentStreak: profile.currentStreak + 1,
                longestStreak: Math.max(profile.longestStreak, profile.currentStreak + 1)
            });
        } else if (profile.currentStreak > 0) {
            // Streak broken
            await updateUserProfile(userId, {
                currentStreak: 1
            });
        } else {
            // Start new streak
            await updateUserProfile(userId, {
                currentStreak: 1
            });
        }
    } catch (error) {
        console.error('Error updating streak:', error);
    }
}

// ============================================
// ACHIEVEMENT FUNCTIONS
// ============================================

export async function checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    try {
        const profile = await getUserProfile(userId);
        if (!profile) return [];

        const unlockedAchievements: UserAchievement[] = [];

        // Get all achievements
        const achievementsSnapshot = await getDocs(collection(db, 'achievements'));
        const allAchievements = achievementsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Achievement[];

        // Get user's current achievements
        const userAchievementsSnapshot = await getDocs(
            collection(db, 'users', userId, 'achievements')
        );
        const currentAchievements = new Set(userAchievementsSnapshot.docs.map(doc => doc.id));

        // Check each achievement
        for (const achievement of allAchievements) {
            if (currentAchievements.has(achievement.id)) continue;

            const isUnlocked = await checkAchievementRequirement(userId, profile, achievement);

            if (isUnlocked) {
                const userAchievement: UserAchievement = {
                    id: achievement.id,
                    unlockedAt: new Date(),
                    seen: false
                };

                await setDoc(
                    doc(db, 'users', userId, 'achievements', achievement.id),
                    {
                        ...userAchievement,
                        unlockedAt: Timestamp.fromDate(userAchievement.unlockedAt)
                    }
                );

                // Award XP
                await updateUserProfile(userId, {
                    totalXP: profile.totalXP + achievement.xpReward
                });

                unlockedAchievements.push(userAchievement);
            }
        }

        return unlockedAchievements;
    } catch (error) {
        console.error('Error checking achievements:', error);
        return [];
    }
}

async function checkAchievementRequirement(
    userId: string,
    profile: UserProfile,
    achievement: Achievement
): Promise<boolean> {
    if (!achievement.requirement) return false;

    const req = achievement.requirement;

    switch (req.type) {
        case 'streak':
            return profile.currentStreak >= req.value;

        case 'exercise_count':
            return profile.totalExercisesCompleted >= req.value;

        case 'lesson_count':
            return profile.totalLessonsCompleted >= req.value;

        case 'xp_total':
            return profile.totalXP >= req.value;

        case 'topic_mastery': {
            const topicProgress = await getTopicProgress(userId, req.topic);
            return topicProgress ? topicProgress.masteryLevel >= req.masteryThreshold : false;
        }

        default:
            return false;
    }
}

// ============================================
// GET USER ACHIEVEMENTS
// ============================================

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
        const achievementsSnapshot = await getDocs(
            collection(db, 'users', userId, 'achievements')
        );

        return achievementsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            unlockedAt: doc.data().unlockedAt?.toDate()
        })) as UserAchievement[];
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        return [];
    }
}