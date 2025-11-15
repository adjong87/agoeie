// src/components/exercises/ConjugationComponent.tsx
import { useState } from 'react';
import type {ConjugationExercise} from "../../models/types.ts";

interface Props {
    exercise: ConjugationExercise;
    onSubmit: (isCorrect: boolean, answer?: string[]) => void;
}

export default function ConjugationComponent({ exercise, onSubmit }: Props) {
    const [answers, setAnswers] = useState<string[]>(
        new Array(exercise.questions.length).fill('')
    );
    const [submitted, setSubmitted] = useState(false);

    const checkAnswers = () => {
        const allCorrect = exercise.questions.every((q, index) => {
            const userAnswer = answers[index]?.toLowerCase().trim() || '';
            return userAnswer === q.correctAnswer.toLowerCase().trim();
        });

        setSubmitted(true);
        onSubmit(allCorrect, answers);
    };

    const allFilled = answers.every(a => a.trim() !== '');

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Vervoeg het werkwoord</h3>
            <p className="text-gray-600 mb-6">
                Werkwoord: <span className="font-semibold">{exercise.verb}</span> ({exercise.translation})
            </p>

            <div className="space-y-4">
                {exercise.questions.map((q, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <span className="w-20 font-medium text-gray-700">{q.pronoun}</span>
                        <input
                            type="text"
                            value={answers[index]}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            disabled={submitted}
                            placeholder="..."
                            title={q.hint}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none disabled:bg-gray-100"
                        />
                        {q.hint && (
                            <span className="text-sm text-gray-500">💡 {q.hint}</span>
                        )}
                    </div>
                ))}
            </div>

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