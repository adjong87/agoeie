// src/pages/ExerciseDemoPage.tsx
import { useState } from 'react';
import ExerciseWrapper from '../components/exercises/ExerciseWrapper';
import type {Exercise, ExerciseResult} from "../models/types.ts";

// Dummy oefeningen voor demo
const demoExercises: Exercise[] = [
    {
        id: 'demo_mc_1',
        type: 'multiple_choice',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'easy',
        question: 'Hoe zeg je "Ik ben" in het Fries?',
        hint: 'Denk aan het woord voor vuilnisbak...',
        explanation: '"Bin" is de eerste persoon enkelvoud van het werkwoord "wêze" (zijn).',
        xpReward: 10,
        options: [
            { id: 'a', text: 'Ik bin', isCorrect: true },
            { id: 'b', text: 'Ik ben', isCorrect: false },
            { id: 'c', text: 'Ik binne', isCorrect: false },
            { id: 'd', text: 'Ik is', isCorrect: false },
        ],
    },
    {
        id: 'demo_fill_1',
        type: 'fill_blank',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'easy',
        question: 'Vul in: Ik ___ Pieter',
        hint: 'Het werkwoord voor "heten"',
        explanation: '"Hjitte" betekent "heten". In de eerste persoon gebruik je "hjit".',
        xpReward: 15,
        correctAnswers: ['hjit'],
        caseSensitive: false,
    },
    {
        id: 'demo_fill_multi_1',
        type: 'fill_blank_multiple',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'easy',
        question: 'Hallo, ik {0} Sanne en ik {1} 25 jier âld',
        explanation: 'Je gebruikt "hjit" voor je naam en "bin" voor je leeftijd.',
        xpReward: 20,
        blanks: [
            { index: 0, correctAnswers: ['hjit'], hint: 'heten...' },
            { index: 1, correctAnswers: ['bin'], hint: 'zijn...' },
        ],
    },
    {
        id: 'demo_order_1',
        type: 'word_order',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'easy',
        question: 'Zet de woorden in de juiste volgorde:',
        translation: 'Ik heet Maria',
        explanation: 'In het Fries is de woordvolgorde Onderwerp - Werkwoord - Naam.',
        xpReward: 20,
        words: ['Ik', 'hjit', 'Maria'],
        correctOrder: ['Ik', 'hjit', 'Maria'],
    },
    {
        id: 'demo_conj_1',
        type: 'conjugation',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'medium',
        verb: 'wêze',
        translation: 'zijn',
        explanation: 'Het werkwoord "wêze" is onregelmatig maar heel belangrijk.',
        xpReward: 25,
        questions: [
            { pronoun: 'ik', correctAnswer: 'bin', hint: 'Denk aan afval...' },
            { pronoun: 'do', correctAnswer: 'bist', hint: 'Voeg -st toe' },
            { pronoun: 'hy', correctAnswer: 'is', hint: 'Hetzelfde als Nederlands' },
            { pronoun: 'wy', correctAnswer: 'binne', hint: 'Meervoudsvorm' },
        ],
    },
    {
        id: 'demo_match_1',
        type: 'match_pairs',
        lessonId: 'lesson_demo_1',
        topic: 'Basics',
        difficulty: 'easy',
        question: 'Verbind de Friese woorden met de Nederlandse vertaling:',
        explanation: 'Dit zijn belangrijke basiswoorden in het Fries.',
        xpReward: 15,
        pairs: [
            { id: 'p1', left: 'hallo', right: 'hallo' },
            { id: 'p2', left: 'goeie', right: 'goeie' },
            { id: 'p3', left: 'hjitte', right: 'heten' },
            { id: 'p4', left: 'wêze', right: 'zijn' },
        ],
    },
];

export default function ExerciseDemoPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [results, setResults] = useState<ExerciseResult[]>([]);

    const handleComplete = (result: ExerciseResult) => {
        setResults([...results, result]);

        // Next exercise
        if (currentIndex < demoExercises.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 500);
        }
    };

    const currentExercise = demoExercises[currentIndex];
    const isFinished = currentIndex >= demoExercises.length;

    const totalXP = results.reduce((sum, r) =>
        sum + (r.isCorrect ? demoExercises.find(
                    e => e.id === r.exerciseId)?.xpReward || 0 : 0
            ), 0
    );

    const correctCount = results.filter(r => r.isCorrect).length;

    if (isFinished) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold mb-4">Goed gedaan!</h2>
                    <p className="text-xl text-gray-600 mb-6">
                        Je hebt alle oefeningen voltooid!
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-indigo-600">{correctCount}</div>
                            <div className="text-sm text-gray-600">Goed</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {demoExercises.length - correctCount}
                            </div>
                            <div className="text-sm text-gray-600">Fout</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{totalXP}</div>
                            <div className="text-sm text-gray-600">XP</div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setResults([]);
                        }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Opnieuw Proberen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-6">
                <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Oefening {currentIndex + 1} van {demoExercises.length}
          </span>
                    <span className="text-sm font-medium text-indigo-600">
            {totalXP} XP
          </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentIndex + 1) / demoExercises.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Current Exercise */}
            <ExerciseWrapper
                exercise={currentExercise}
                onComplete={handleComplete}
            />

            {/* Results Summary */}
            {results.length > 0 && (
                <div className="max-w-2xl mx-auto mt-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold mb-2">Resultaten tot nu toe:</h3>
                        <div className="flex gap-2">
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                        result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                >
                                    {result.isCorrect ? '✓' : '✗'}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}