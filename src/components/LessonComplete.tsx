import { completeLessonProgress, checkAndUnlockAchievements } from '../lib/crud.ts'

// Reusable helper to finalize a lesson. Call this from pages/components.
export async function completeLessonHandler(
    userId: string,
    lessonId: string,
    totalScore: number,
    totalTime: number,
    xpEarned: number,
    navigate: (to: string) => void
) {
    try {
        // Markeer les als voltooid
        await completeLessonProgress(userId, lessonId, totalScore, totalTime, xpEarned);

        // Check voor nieuwe achievements
        const newAchievements = await checkAndUnlockAchievements(userId);

        if (newAchievements.length > 0) {
            // Toon achievement notificaties
            newAchievements.forEach(achievement => {
                console.log(`Achievement unlocked: ${achievement.id}`);
            });
        }

        // Navigeer naar overzichtspagina
        navigate('/lessons');
    } catch (error) {
        console.error('Error completing lesson:', error);
    }
}