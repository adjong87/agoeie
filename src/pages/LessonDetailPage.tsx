// src/pages/LessonDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, getExercisesByIds, recordExerciseAttempt } from '../lib/crud';
import ExerciseWrapper from '../components/exercises/ExerciseWrapper';
import {useAuth} from "../hooks/useAuth.ts";
import type {Exercise, ExerciseResult, Lesson} from "../models/types.ts";

export default function LessonDetailPage() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [results, setResults] = useState<ExerciseResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(true); // Toggle tussen content en oefeningen

    // Laad les data
    useEffect(() => {
        async function loadLesson() {
            if (!lessonId) return;

            try {
                setLoading(true);
                const lessonData = await getLesson(lessonId);

                if (!lessonData) {
                    console.error('Les niet gevonden');
                    return;
                }

                setLesson(lessonData);

                // Verzamel alle exercise IDs uit de lesson content
                const exerciseIds: string[] = [];
                lessonData.content.forEach(content => {
                    if (content.type === 'exercise_block') {
                        exerciseIds.push(...content.data.exerciseIds);
                    }
                });

                // Haal exercises op
                if (exerciseIds.length > 0) {
                    const exerciseData = await getExercisesByIds(exerciseIds);
                    setExercises(exerciseData);
                }
            } catch (error) {
                console.error('Error loading lesson:', error);
            } finally {
                setLoading(false);
            }
        }

        loadLesson();
    }, [lessonId]);

    // Handler voor wanneer een oefening is voltooid
    const handleExerciseComplete = async (result: ExerciseResult) => {
        // Bewaar resultaat
        setResults([...results, result]);

        // Sla op in Firebase (alleen als user is ingelogd)
        if (user) {
            try {
                await recordExerciseAttempt(
                    user.uid,
                    result.exerciseId,
                    result.isCorrect,
                    result.timeSpent,
                    0 // hintsUsed - kun je later toevoegen
                );
            } catch (error) {
                console.error('Error saving exercise result:', error);
            }
        }

        // Ga naar volgende oefening
        if (currentExerciseIndex < exercises.length - 1) {
            setTimeout(() => {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
            }, 500);
        } else {
            // Alle oefeningen voltooid
            setTimeout(() => {
                handleLessonComplete();
            }, 1000);
        }
    };

    // Handler voor wanneer de hele les is voltooid
    const handleLessonComplete = () => {
        const totalCorrect = results.filter(r => r.isCorrect).length;
        const score = Math.round((totalCorrect / exercises.length) * 100);
        const totalXP = results.reduce((sum, r) => {
            const exercise = exercises.find(e => e.id === r.exerciseId);
            return sum + (r.isCorrect ? (exercise?.xpReward || 0) : 0);
        }, 0);

        // Toon resultaten of navigeer naar volgende pagina
        alert(`Les voltooid!\nScore: ${score}%\nXP verdiend: ${totalXP}`);

        if (user) {
            navigate('/dashboard');
        }
    };

    // Render lesson content (zonder oefeningen)
    const renderLessonContent = () => {
        if (!lesson) return null;

        return lesson.content.map((content, index) => {
            switch (content.type) {
                case 'intro':
                    return (
                        <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                            <p className="text-gray-800 leading-relaxed">{content.data.text}</p>
                            {content.data.textFy && (
                                <p className="text-gray-600 italic mt-2">{content.data.textFy}</p>
                            )}
                        </div>
                    );

                case 'vocabulary':
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">{content.data.title}</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {content.data.words.map((word, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <span className="font-medium text-indigo-600">{word.fy}</span>
                                            <span className="mx-2">-</span>
                                            <span className="text-gray-700">{word.nl}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{word.pronunciation}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

                case 'grammar':
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-3">{content.data.title}</h3>
                            <p className="text-gray-700 mb-4 leading-relaxed">{content.data.explanation}</p>

                            {content.data.examples && content.data.examples.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Voorbeelden:</h4>
                                    {content.data.examples.map((example, i) => (
                                        <div key={i} className="bg-gray-50 p-3 rounded mb-2">
                                            <p className="font-medium text-indigo-600">{example.fy}</p>
                                            <p className="text-gray-600 text-sm">{example.nl}</p>
                                            <p className="text-gray-500 text-xs mt-1">{example.explanation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {content.data.conjugationTable && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 border">Pronoun</th>
                                            <th className="px-4 py-2 border">Fries</th>
                                            <th className="px-4 py-2 border">Nederlands</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {content.data.conjugationTable.conjugations.map((conj, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-2 border font-medium">{conj.pronoun}</td>
                                                <td className="px-4 py-2 border text-indigo-600">{conj.form}</td>
                                                <td className="px-4 py-2 border text-gray-600">{conj.translation}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {content.data.tips && content.data.tips.length > 0 && (
                                <div className="mt-4 bg-yellow-50 p-3 rounded">
                                    <h4 className="font-medium mb-2">💡 Tips:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {content.data.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-gray-700">{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );

                case 'summary':
                    return (
                        <div key={index} className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                            <h3 className="text-xl font-semibold mb-3">{content.data.title}</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {content.data.points.map((point, i) => (
                                    <li key={i} className="text-gray-700">{point}</li>
                                ))}
                            </ul>
                        </div>
                    );

                case 'exercise_block':
                    // Toon knop om naar oefeningen te gaan
                    return (
                        <div key={index} className="bg-indigo-50 border-2 border-indigo-300 p-6 rounded-lg mb-6 text-center">
                            <h3 className="text-xl font-semibold mb-2">Tijd om te oefenen! 💪</h3>
                            <p className="text-gray-600 mb-4">
                                Je hebt {content.data.exerciseIds.length} oefeningen voor dit onderdeel
                            </p>
                            <button
                                onClick={() => setShowContent(false)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Start Oefeningen
                            </button>
                        </div>
                    );

                default:
                    return null;
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Les laden...</p>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600">Les niet gevonden</p>
            </div>
        );
    }

    // Toon content of oefeningen
    if (showContent) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                    <p className="text-gray-600 mt-2">{lesson.description}</p>
                    <div className="flex gap-4 mt-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              {lesson.level}
            </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              +{lesson.xpReward} XP
            </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              ~{lesson.estimatedMinutes} min
            </span>
                    </div>
                </div>

                {renderLessonContent()}
            </div>
        );
    }

    // Toon oefeningen
    const currentExercise = exercises[currentExerciseIndex];
    const isFinished = currentExerciseIndex >= exercises.length;

    if (isFinished || !currentExercise) {
        const totalCorrect = results.filter(r => r.isCorrect).length;
        const score = Math.round((totalCorrect / exercises.length) * 100);

        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold mb-4">Les Voltooid!</h2>
                    <p className="text-xl text-gray-600 mb-6">
                        Je hebt alle oefeningen van deze les voltooid!
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">{score}%</div>
                            <div className="text-sm text-gray-600">Score</div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="text-3xl font-bold text-indigo-600">
                                {results.reduce((sum, r) => {
                                    const ex = exercises.find(e => e.id === r.exerciseId);
                                    return sum + (r.isCorrect ? (ex?.xpReward || 0) : 0);
                                }, 0)}
                            </div>
                            <div className="text-sm text-gray-600">XP Verdiend</div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setShowContent(true);
                                setCurrentExerciseIndex(0);
                                setResults([]);
                            }}
                            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                        >
                            Bekijk Les Opnieuw
                        </button>
                        <button
                            onClick={() => navigate('/lessons')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Volgende Les
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Progress */}
            <div className="max-w-2xl mx-auto mb-6">
                <button
                    onClick={() => setShowContent(true)}
                    className="text-indigo-600 hover:text-indigo-700 mb-4"
                >
                    ← Terug naar les inhoud
                </button>

                <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Oefening {currentExerciseIndex + 1} van {exercises.length}
          </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Current Exercise */}
            <ExerciseWrapper
                exercise={currentExercise}
                onComplete={handleExerciseComplete}
            />
        </div>
    );
}