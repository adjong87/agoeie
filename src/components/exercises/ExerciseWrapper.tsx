// src/components/exercises/ExerciseWrapper.tsx
import { useEffect, useState } from 'react';
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
    const [startTime, setStartTime] = useState(Date.now());
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [userAnswer, setUserAnswer] = useState<string | string[] | undefined>();

    // Reset transient UI state when the exercise changes
    useEffect(() => {
        setShowFeedback(false);
        setIsCorrect(false);
        setUserAnswer(undefined);
        setStartTime(Date.now());
    }, [exercise.id]);

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
                // Use the submitted answer directly to avoid any stale state
                userAnswer: answer,
            });
        }, 2000);
    };

    // Allow skipping unsupported exercise types without blocking the flow
    const skipUnknown = () => {
        console.warn('Unsupported exercise type encountered:', exercise.type);
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        onComplete({
            exerciseId: exercise.id,
            isCorrect: false,
            timeSpent,
            userAnswer: undefined,
        });
    };

    // Render correct component based on type
    const renderExercise = () => {
        switch (exercise.type) {
            case 'multiple_choice':
                return <MultipleChoiceComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            case 'fill_blank':
                return <FillBlankComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            case 'fill_blank_multiple':
                return <FillBlankMultipleComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            case 'word_order':
                return <WordOrderComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            case 'conjugation':
                return <ConjugationComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            case 'match_pairs':
                return <MatchPairsComponent key={exercise.id} exercise={exercise} onSubmit={handleSubmit} />;
            default:
                return (
                    <div className="text-center">
                        <div className="mb-3 text-red-600 font-semibold">Onbekend oefeningtype: {String(exercise.type)}</div>
                        <p className="text-gray-700 mb-4">
                            Deze oefening wordt nog niet ondersteund. Je kunt deze stap overslaan en doorgaan met de les.
                        </p>
                        <button
                            onClick={skipUnknown}
                            className="px-6 py-3 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Sla deze oefening over
                        </button>
                    </div>
                );
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