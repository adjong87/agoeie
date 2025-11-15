// src/components/exercises/FillBlankMultipleComponent.tsx
import { useEffect, useMemo, useState } from 'react';
import type {FillBlankMultipleExercise} from "../../models/types.ts";

interface Props {
    exercise: FillBlankMultipleExercise;
    onSubmit: (isCorrect: boolean, answer?: string[]) => void;
}

export default function FillBlankMultipleComponent({ exercise, onSubmit }: Props) {
    // Ensure the answers array covers the highest index used in blanks
    const initialLength = useMemo(() => {
        const maxIdx = exercise.blanks.length > 0
            ? Math.max(...exercise.blanks.map(b => b.index))
            : -1;
        return Math.max(maxIdx + 1, exercise.blanks.length);
    }, [exercise]);

    const [answers, setAnswers] = useState<string[]>(new Array(initialLength).fill(''));
    const [submitted, setSubmitted] = useState(false);

    // Reset when the exercise changes
    useEffect(() => {
        setSubmitted(false);
        const maxIdx = exercise.blanks.length > 0
            ? Math.max(...exercise.blanks.map(b => b.index))
            : -1;
        const len = Math.max(maxIdx + 1, exercise.blanks.length);
        setAnswers(new Array(len).fill(''));
    }, [exercise.id]);

    // Parse sentence and replace {0}, {1} with inputs
    const renderSentence = () => {
        const hasPlaceholders = /\{\d+\}/.test(exercise.question);

        // Graceful fallback: if no placeholders present, render the question text
        // and then a sequence of inputs for each blank.
        if (!hasPlaceholders) {
            return (
                <div>
                    <span>{exercise.question}</span>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {exercise.blanks.map((blank, idx) => (
                            <input
                                key={idx}
                                type="text"
                                value={answers[blank.index] || ''}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[blank.index] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                disabled={submitted}
                                placeholder={blank.hint || '...'}
                                className="px-3 py-1 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 disabled:bg-gray-100 text-center min-w-[100px]"
                                title={blank?.hint}
                                aria-label={`Blank ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        const parts = exercise.question.split(/(\{\d+\})/);

        return parts.map((part: string, index: number) => {
            const match = part.match(/\{(\d+)\}/);
            if (match) {
                const blankIndex = parseInt(match[1]);
                const blank = exercise.blanks.find(b => b.index === blankIndex);

                return (
                    <input
                        key={index}
                        type="text"
                        value={answers[blankIndex] || ''}
                        onChange={(e) => {
                            const newAnswers = [...answers];
                            newAnswers[blankIndex] = e.target.value;
                            setAnswers(newAnswers);
                        }}
                        disabled={submitted}
                        placeholder={blank?.hint || '...'}
                        className="inline-block mx-1 px-3 py-1 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 disabled:bg-gray-100 text-center min-w-[100px]"
                        title={blank?.hint}
                        aria-label={`Blank ${blankIndex + 1}`}
                    />
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const checkAnswers = () => {
        const allCorrect = exercise.blanks.every((blank) => {
            const userAnswer = answers[blank.index]?.toLowerCase().trim() || '';
            return blank.correctAnswers.some(
                correct => correct.toLowerCase().trim() === userAnswer
            );
        });

        setSubmitted(true);
        onSubmit(allCorrect, answers);
    };

    // Only require the indices that correspond to actual blanks to be filled
    const allFilled = exercise.blanks.every(b => (answers[b.index] ?? '').trim() !== '');

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>

            <div className="text-lg leading-relaxed mb-6 p-4 bg-gray-50 rounded-lg">
                {renderSentence()}
            </div>

            {exercise.blanks.some(b => b.hint) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-2">💡 Hints:</p>
                    {exercise.blanks.map((blank, idx) => blank.hint && (
                        <p key={idx} className="text-sm text-blue-600">
                            {idx + 1}. {blank.hint}
                        </p>
                    ))}
                </div>
            )}

            <button
                onClick={checkAnswers}
                disabled={!allFilled || submitted}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                Controleer
            </button>
        </div>
    );
}