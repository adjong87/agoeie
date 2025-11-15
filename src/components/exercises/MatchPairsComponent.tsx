// src/components/exercises/MatchPairsComponent.tsx
import { useState } from 'react';
import type {MatchPairsExercise} from "../../models/types.ts";

interface Props {
    exercise: MatchPairsExercise;
    onSubmit: (isCorrect: boolean, answer?: string[]) => void;
}

export default function MatchPairsComponent({ exercise, onSubmit }: Props) {
    const [selected, setSelected] = useState<{left?: string; right?: string}>({});
    const [matches, setMatches] = useState<Array<{left: string; right: string}>>([]);
    const [submitted, setSubmitted] = useState(false);

    // Shuffle right side
    const [shuffledRight] = useState(() =>
        [...exercise.pairs.map(p => ({id: p.id, text: p.right}))]
            .sort(() => Math.random() - 0.5)
    );

    const handleLeftClick = (text: string) => {
        if (submitted || matches.some(m => m.left === text)) return;
        if (selected.right) {
            setMatches([...matches, { left: text, right: selected.right }]);
            setSelected({});
        } else {
            setSelected({ left: text });
        }
    };

    const handleRightClick = (text: string) => {
        if (submitted || matches.some(m => m.right === text)) return;
        if (selected.left) {
            setMatches([...matches, { left: selected.left, right: text }]);
            setSelected({});
        } else {
            setSelected({ right: text });
        }
    };

    const checkMatches = () => {
        const allCorrect = matches.every(match => {
            const pair = exercise.pairs.find(p => p.left === match.left);
            return pair?.right === match.right;
        });

        setSubmitted(true);
        onSubmit(allCorrect, matches.map(m => `${m.left}:${m.right}`));
    };

    const isMatched = (text: string) =>
        matches.some(m => m.left === text || m.right === text);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">{exercise.question}</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-2">
                    {exercise.pairs.map(pair => (
                        <button
                            key={pair.id}
                            onClick={() => handleLeftClick(pair.left)}
                            disabled={submitted || isMatched(pair.left)}
                            className={`w-full p-3 text-left rounded-lg border-2 transition ${
                                isMatched(pair.left)
                                    ? 'bg-green-100 border-green-500'
                                    : selected.left === pair.left
                                        ? 'bg-indigo-100 border-indigo-500'
                                        : 'bg-white border-gray-300 hover:border-indigo-300'
                            } disabled:opacity-60`}
                        >
                            {pair.left}
                        </button>
                    ))}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                    {shuffledRight.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleRightClick(item.text)}
                            disabled={submitted || isMatched(item.text)}
                            className={`w-full p-3 text-left rounded-lg border-2 transition ${
                                isMatched(item.text)
                                    ? 'bg-green-100 border-green-500'
                                    : selected.right === item.text
                                        ? 'bg-indigo-100 border-indigo-500'
                                        : 'bg-white border-gray-300 hover:border-indigo-300'
                            } disabled:opacity-60`}
                        >
                            {item.text}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={checkMatches}
                disabled={matches.length !== exercise.pairs.length || submitted}
                className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                Controleer
            </button>
        </div>
    );
}