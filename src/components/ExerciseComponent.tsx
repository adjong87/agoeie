// components/ExerciseComponent.tsx
import { useState } from 'react';
import { recordExerciseAttempt, updateTopicProgress } from '../lib/crud.ts';
import type {Exercise} from "../models/types.ts";

export default function ExerciseComponent({
                                              exercise,
                                              userId
                                          }: {
    exercise: Exercise;
    userId: string;
}) {
    const [userAnswer, setUserAnswer] = useState('');
    const [startTime] = useState(Date.now());

    async function handleSubmit() {
        const isCorrect = checkAnswer(userAnswer, exercise);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        try {
            // Sla de poging op
            await recordExerciseAttempt(
                userId,
                exercise.id,
                isCorrect,
                timeSpent,
                0 // hintsUsed
            );

            // Update topic progress
            const score = isCorrect ? 100 : 0;
            await updateTopicProgress(userId, exercise.topic, exercise.id, score);

            // Toon feedback
            if (isCorrect) {
                alert(`Goed gedaan! +${exercise.xpReward} XP`);
            } else {
                alert('Helaas, probeer het nog eens!');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    }

    return (
        <div>
            <h3>{exercise.question}</h3>
            <input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
            />
            <button onClick={handleSubmit}>Controleer</button>
        </div>
    );
}

function checkAnswer(userAnswer: string, exercise: Exercise): boolean {
    // Implementatie hangt af van exercise type
    if (exercise.type === 'fill_blank') {
        return exercise.correctAnswers.some(
            answer => answer.toLowerCase() === userAnswer.toLowerCase()
        );
    }
    // ... andere types
    return false;
}