// src/components/exercises/FillBlankMultipleComponent.tsx
import { useState } from 'react';
import type {FillBlankMultipleExercise} from "../../models/types.ts";

interface Props {
    exercise: FillBlankMultipleExercise;
    onSubmit: (isCorrect: boolean, answer?: string[]) => void;
}

export default function FillBlankMultipleComponent({ exercise, onSubmit }: Props) {
    const [answers, setAnswers] = useState<string[]>(
        new Array(exercise.blanks.length).fill('')
    );
    const [submitted, setSubmitted] = useState(false);

    // Parse sentence and replace {0}, {1} with inputs
    const renderSentence = () => {
        const parts = exercise.sentence.split(/(\{\d+\})/);

        return parts.map((part, index) => {
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
                        placeholder="..."
                        className="inline-block mx-1 px-3 py-1 border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 disabled:bg-gray-100 text-center min-w-[100px]"
                        title={blank?.hint}
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

    const allFilled = answers.every(a => a.trim() !== '');

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