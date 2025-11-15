// src/components/exercises/ExerciseWrapper.tsx
import { useState, useEffect } from 'react';
import MultipleChoiceComponent from "./MultipleChoiceComponent.tsx";
import FillBlankComponent from "./FillBlankComponent.tsx";
import FillBlankMultipleComponent from "./FillBlankMultipleComponent.tsx";
import WordOrderComponent from "./WordOrderComponent.tsx";
import ConjugationComponent from "./ConjugationComponent.tsx";
import MatchPairsComponent from "./MatchPairsComponent.tsx";
import type {Exercise, ExerciseResult} from "../../models/types.ts";


interface Props {
    exercise: Exercise;
    onComplete: (result: ExerciseResult) => void;
}

export default function ExerciseWrapper({ exercise, onComplete }: Props) {
    const [startTime] = useState(Date.now());
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userAnswer, setUserAnswer] = useState<string | string[] | undefined>();

    const handleSubmit = (correct: boolean, answer?: string | string[]) => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        setIsCorrect(correct);
        setUserAnswer(answer);
        setShowFeedback(true);

        // Wacht 2 seconden voor feedback, dan complete
        setTimeout(() => {
            onComplete({
                exerciseId: exercise.id,
                isCorrect: correct,
                timeSpent,
                userAnswer: answer,
            });
        }, 2000);
    };

    // Render correct component based on type
    const renderExercise = () => {
        switch (exercise.type) {
            case 'multiple_choice':
                return <MultipleChoiceComponent exercise={exercise} onSubmit={handleSubmit} />;
            case 'fill_blank':
                return <FillBlankComponent exercise={exercise} onSubmit={handleSubmit} />;
            case 'fill_blank_multiple':
                return <FillBlankMultipleComponent exercise={exercise} onSubmit={handleSubmit} />;
            case 'word_order':
                return <WordOrderComponent exercise={exercise} onSubmit={handleSubmit} />;
            case 'conjugation':
                return <ConjugationComponent exercise={exercise} onSubmit={handleSubmit} />;
            case 'match_pairs':
                return <MatchPairsComponent exercise={exercise} onSubmit={handleSubmit} />;
            default:
                return <div>Onbekend oefening type</div>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Oefening {exercise.type.replace('_', ' ')}
        </span>
                <span className="text-sm font-medium text-indigo-600">
          +{exercise.xpReward} XP
        </span>
            </div>

            {/* Exercise Content */}
            {renderExercise()}

            {/* Feedback */}
            {showFeedback && (
                <div className={`mt-6 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                }`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                        <span className="font-semibold text-lg">
              {isCorrect ? 'Goed gedaan!' : 'Helaas, niet helemaal juist'}
            </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        {exercise.explanation}
                    </p>
                </div>
            )}
        </div>
    );
}