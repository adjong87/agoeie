import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLesson, getExercisesByLesson } from '../lib/crud';
import type {Exercise, Lesson} from "../models/types.ts";

export default function LessonDetail() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLesson() {
            if (!lessonId) return;

            const lessonData = await getLesson(lessonId);
            setLesson(lessonData);

            if (lessonData) {
                const exerciseData = await getExercisesByLesson(lessonId);
                setExercises(exerciseData);
            }

            setLoading(false);
        }
        loadLesson();
    }, [lessonId]);

    if (loading) return <div>Les laden...</div>;
    if (!lesson) return <div>Les niet gevonden</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-gray-600 mb-6">{lesson.description}</p>

            {/* Render lesson content */}
            {lesson.content.map((content, index) => (
                <div key={index} className="mb-6">
                    {content.type === 'intro' && (
                        <div className="bg-blue-50 p-4 rounded">
                            <p>{content.data.text}</p>
                        </div>
                    )}

                    {content.type === 'vocabulary' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-3">{content.data.title}</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {content.data.words.map((word, i) => (
                                    <div key={i} className="border p-2 rounded">
                                        <strong>{word.fy}</strong> - {word.nl}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add more content type renderers */}
                </div>
            ))}

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Oefeningen</h2>
                <p>{exercises.length} oefeningen beschikbaar</p>
            </div>
        </div>
    );
}