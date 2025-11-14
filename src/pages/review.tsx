import { useEffect, useState } from 'react';
import { getExercisesForReview, getExercisesByIds } from '../lib/crud.ts'
import type { Exercise } from '../models/types.ts';

export default function ReviewPage({ userId }: { userId: string }) {
    const [reviewExercises, setReviewExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        async function loadReviewExercises() {
            // Haal IDs op van oefeningen die herzien moeten worden
            const exerciseIds = await getExercisesForReview(userId);

            // Haal de volledige oefening data op
            const exercises = await getExercisesByIds(exerciseIds);
            setReviewExercises(exercises);
        }

        loadReviewExercises();
    }, [userId]);

    if (reviewExercises.length === 0) {
        return <div>Geen oefeningen om te herhalen! 🎉</div>;
    }

    return (
        <div>
            <h1>Herhaling ({reviewExercises.length} oefeningen)</h1>
            {reviewExercises.map(exercise => (
                <div key={exercise.id}>
                    {/* Render exercise component */}
                </div>
            ))}
        </div>
    );
}