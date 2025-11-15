import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getExercisesForReview, getExercisesByIds, getUserProfile } from '../lib/crud.ts'
import type { Exercise } from '../models/types.ts';
import levelsData from '../models/levels.json';

export default function ReviewPage({ userId }: { userId: string }) {
    const [reviewExercises, setReviewExercises] = useState<Exercise[]>([]);
    const [totalXP, setTotalXP] = useState<number>(0);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { mistakeIds?: string[] } | null;
    const mistakeIds = state?.mistakeIds ?? [];

    useEffect(() => {
        async function loadReviewExercises() {
            // 1) Prioriteit: fouten van vorige sessie (meegenomen vanaf les-overzicht)
            if (mistakeIds && mistakeIds.length > 0) {
                const exercises = await getExercisesByIds(mistakeIds);
                setReviewExercises(exercises);
                return;
            }

            // 2) Anders: geplande herhaling o.b.v. spaced repetition
            const exerciseIds = await getExercisesForReview(userId);
            const exercises = await getExercisesByIds(exerciseIds);
            setReviewExercises(exercises);
        }

        loadReviewExercises();
    }, [mistakeIds, userId]);

    // Load user XP for level computation
    useEffect(() => {
        async function loadProfileXP() {
            if (!userId) return;
            try {
                const profile = await getUserProfile(userId);
                setTotalXP(profile?.totalXP ?? 0);
            } catch (e) {
                console.error('Failed to load profile for XP:', e);
                setTotalXP(0);
            }
        }
        void loadProfileXP();
    }, [userId]);

    type LevelDef = { level: number; minXP: number; maxXP: number; title: string; titleFy: string };

    const currentLevel = useMemo(() => {
        const levels = (levelsData as { levels: LevelDef[] }).levels;
        // Find the level where minXP <= xp < maxXP; if above highest max, pick last
        const found = levels.find(l => totalXP >= l.minXP && totalXP < l.maxXP);
        return found ?? levels[levels.length - 1];
    }, [totalXP]);

    // Safe, typed heading extractor to avoid TS errors on unions
    function getExerciseHeading(ex: Exercise, idx: number): string {
        if ('question' in ex && typeof ex.question === 'string' && ex.question.trim().length > 0) {
            return ex.question;
        }
        if (ex.type === 'conjugation') {
            return `Vervoeging: ${ex.verb}`;
        }
        // Word order, match_pairs, translation etc. generally have question field already handled above.
        return `Oefening ${idx + 1}`;
    }

    if (reviewExercises.length === 0) {
        return (
            <div className="max-w-3xl mx-auto">
                {/* Top utility bar with Back */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => {
                            if (window.history.length > 1) navigate(-1);
                            else navigate('/lessons');
                        }}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        ← Terug
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-2">Herhalen</h1>
                    <p className="text-gray-600">Geen oefeningen om te herhalen! 🎉</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Top utility bar with Back */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => {
                        if (window.history.length > 1) navigate(-1);
                        else navigate('/lessons');
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                    ← Terug
                </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h1 className="text-2xl font-bold">Herhaling</h1>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                            {totalXP} XP
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium">
                            Level {currentLevel.level}: {currentLevel.title}
                        </span>
                    </div>
                </div>
                {mistakeIds.length > 0 ? (
                    <p className="text-gray-600">Dit zijn de vragen die je net fout had. Bekijk ze nog eens rustig.</p>
                ) : (
                    <p className="text-gray-600">Oefeningen die klaarstaan voor herhaling op basis van jouw voortgang.</p>
                )}
            </div>

            <div className="space-y-4">
                {reviewExercises.map((exercise, idx) => (
                    <div key={exercise.id} className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{getExerciseHeading(exercise, idx)}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {exercise.type}
                            </span>
                        </div>
                        {exercise.explanation && (
                            <p className="text-sm text-gray-600 mb-2">{exercise.explanation}</p>
                        )}
                        {/* Toon mogelijke correcte antwoorden als beschikbaar */}
                        {'correctAnswers' in exercise && Array.isArray((exercise as any).correctAnswers) && (
                            <div className="text-sm">
                                <span className="text-gray-600">Correcte antwoorden: </span>
                                <span className="font-medium text-green-700">{(exercise as any).correctAnswers.join(', ')}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}