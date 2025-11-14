import { useEffect, useState } from 'react';
import { getLessonProgress } from '../lib/crud.ts';
import type { LessonProgress } from '../models/types.ts';

export default function LessonProgressDisplay({
                                                  userId,
                                                  lessonId
                                              }: {
    userId: string;
    lessonId: string;
}) {
    const [progress, setProgress] = useState<LessonProgress | null>(null);

    useEffect(() => {
        async function loadProgress() {
            const data = await getLessonProgress(userId, lessonId);
            setProgress(data);
        }
        loadProgress();
    }, [userId, lessonId]);

    if (!progress) {
        return <div>Je hebt deze les nog niet gestart</div>;
    }

    return (
        <div>
            <p>Status: {progress.status}</p>
            {progress.status === 'completed' && (
                <>
                    <p>Score: {progress.score}%</p>
                    <p>Sterren: {'⭐'.repeat(progress.starsEarned || 0)}</p>
                    <p>Pogingen: {progress.attempts}</p>
                    <p>Tijd besteed: {Math.floor(progress.timeSpentSeconds / 60)} minuten</p>
                    <p>XP verdiend: {progress.xpEarned}</p>
                </>
            )}
        </div>
    );
}