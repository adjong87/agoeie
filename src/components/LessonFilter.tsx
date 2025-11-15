import { useState, useEffect } from 'react';
import {getAllLessons, getLessonsByLevel, getLessonsByTopic} from '../lib/crud.ts';
import type { Lesson } from '../models/types.ts';

interface LessonFilterProps {
    onFiltered?: (lessons: Lesson[]) => void;
    renderList?: boolean; // default true: render internal list; set false to let parent render
}

export default function LessonFilter({ onFiltered, renderList = true }: LessonFilterProps) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [filter, setFilter] = useState<'all' | 'level' | 'topic'>('all');
    const [selectedLevel, setSelectedLevel] = useState<string>('A1');
    const [selectedTopic, setSelectedTopic] = useState<string>('basics');

    useEffect(() => {
        async function loadFilteredLessons() {
            let data: Lesson[];

            if (filter === 'level') {
                data = await getLessonsByLevel(selectedLevel);
            } else if (filter === 'topic') {
                data = await getLessonsByTopic(selectedTopic);
            } else {
                data = await getAllLessons();
            }

            setLessons(data);
        }

        loadFilteredLessons();
    }, [filter, selectedLevel, selectedTopic]);

    useEffect(() => {
        if (onFiltered) onFiltered(lessons);
    }, [lessons, onFiltered]);

    return (
        <div className="p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded border text-sm transition ${
                        filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    Alles
                </button>
                <button
                    onClick={() => setFilter('level')}
                    className={`px-3 py-1.5 rounded border text-sm transition ${
                        filter === 'level' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    Per Niveau
                </button>
                <button
                    onClick={() => setFilter('topic')}
                    className={`px-3 py-1.5 rounded border text-sm transition ${
                        filter === 'topic' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    Per Onderwerp
                </button>
            </div>

            {filter === 'level' && (
                <div className="mt-2">
                    <label className="block text-sm text-gray-700 mb-1">Kies niveau</label>
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="block w-full max-w-xs rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option className="text-gray-900" value="A1">A1</option>
                        <option className="text-gray-900" value="A2">A2</option>
                        <option className="text-gray-900" value="B1">B1</option>
                        <option className="text-gray-900" value="B2">B2</option>
                        <option className="text-gray-900" value="C1">C1</option>
                        <option className="text-gray-900" value="C2">C2</option>
                    </select>
                </div>
            )}

            {filter === 'topic' && (
                <div className="mt-2">
                    <label className="block text-sm text-gray-700 mb-1">Kies onderwerp</label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="block w-full max-w-xs rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option className="text-gray-900" value="basics">Basis</option>
                        <option className="text-gray-900" value="verbs">Werkwoorden</option>
                        <option className="text-gray-900" value="vocabulary">Woordenschat</option>
                    </select>
                </div>
            )}

            {renderList && (
                <div className="mt-4 divide-y">
                    {lessons.map(lesson => (
                        <div key={lesson.id} className="py-2">{lesson.title}</div>
                    ))}
                </div>
            )}
        </div>
    );
}