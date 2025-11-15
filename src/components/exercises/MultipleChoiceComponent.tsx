import { useEffect, useState } from 'react';
import type {MultipleChoiceExercise} from "../../models/types.ts";

interface Props {
    exercise: MultipleChoiceExercise;
    onSubmit: (isCorrect: boolean, answer?: string) => void;
}

export default function MultipleChoiceComponent({ exercise, onSubmit }: Props) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    // Reset local state when we move to a new exercise (e.g., two MC in a row)
    useEffect(() => {
        setSelectedOption(null);
        setSubmitted(false);
    }, [exercise.id]);

    const handleSubmit = () => {
        if (!selectedOption) return;

        const isCorrect = exercise.options.find(opt => opt.id === selectedOption)?.isCorrect || false;
        setSubmitted(true);
        onSubmit(isCorrect, selectedOption);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>

            {exercise.hint && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">💡 Hint: {exercise.hint}</span>
                </div>
            )}

            <div className="space-y-3">
                {exercise.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => !submitted && setSelectedOption(option.id)}
                        disabled={submitted}
                        className={`w-full p-4 text-left border-2 rounded-lg transition ${
                            selectedOption === option.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                        } ${submitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                        {option.text}
                    </button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!selectedOption || submitted}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                Controleer
            </button>
        </div>
    );
}