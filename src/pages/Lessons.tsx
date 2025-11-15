// src/pages/Lessons.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLessons } from '../lib/crud';
import type {Lesson} from "../models/types.ts";
import LessonFilter from "../components/LessonFilter.tsx";
import LessonProgress from "../components/LessonProgress.tsx";
import {useAuth} from "../hooks/useAuth.ts";

export default function Lessons() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        async function loadLessons() {
            const data = await getAllLessons();
            setLessons(data);
            setLoading(false);
        }
        loadLessons();
    }, []);

    if (loading) return <div>Lessen laden...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Friese Lessen</h1>

            {/* Filter */}
            <div className="mb-6">
                <LessonFilter
                    renderList={false}
                    onFiltered={(filtered) => setLessons(filtered)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map(lesson => (
                    <Link
                        key={lesson.id}
                        to={`/lessons/${lesson.id}`}
                        className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                        <p className="text-gray-600 mt-2">{lesson.description}</p>
                        <div className="mt-4 flex justify-between">
              <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                {lesson.level}
              </span>
                            <span className="text-sm">⭐ {lesson.xpReward} XP</span>
                        </div>
                        {/* Progress preview (doesn't block navigation) */}
                        {user && (
                            <div className="mt-3 text-sm text-gray-700">
                                <LessonProgress userId={user.uid} lessonId={lesson.id} />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}