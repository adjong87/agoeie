import { useState } from 'react';
import type {WordOrderExercise} from "../../models/types.ts";

interface Props {
    exercise: WordOrderExercise;
    onSubmit: (isCorrect: boolean, answer?: string[]) => void;
}

export default function WordOrderComponent({ exercise, onSubmit }: Props) {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>(
        [...exercise.words].sort(() => Math.random() - 0.5) // Shuffle
    );
    const [submitted, setSubmitted] = useState(false);

    const selectWord = (word: string) => {
        if (submitted) return;
        setSelectedWords([...selectedWords, word]);
        setAvailableWords(availableWords.filter(w => w !== word));
    };

    const removeWord = (word: string, index: number) => {
        if (submitted) return;
        setSelectedWords(selectedWords.filter((_, i) => i !== index));
        setAvailableWords([...availableWords, word]);
    };

    const checkOrder = () => {
        const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(exercise.correctOrder);
        setSubmitted(true);
        onSubmit(isCorrect, selectedWords);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>

            <p className="text-gray-600 mb-4">Vertaling: {exercise.translation}</p>

            {/* Selected words area */}
            <div className="min-h-[80px] p-4 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">Jouw zin:</p>
                <div className="flex flex-wrap gap-2">
                    {selectedWords.length === 0 ? (
                        <span className="text-gray-400">Sleep woorden hierheen...</span>
                    ) : (
                        selectedWords.map((word, index) => (
                            <button
                                key={index}
                                onClick={() => removeWord(word, index)}
                                disabled={submitted}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition"
                            >
                                {word}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Available words */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Beschikbare woorden:</p>
                <div className="flex flex-wrap gap-2">
                    {availableWords.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => selectWord(word)}
                            disabled={submitted}
                            className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-60 transition"
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={checkOrder}
                disabled={selectedWords.length !== exercise.words.length || submitted}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                Controleer
            </button>
        </div>
    );
}