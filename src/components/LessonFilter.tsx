// components/LessonFilter.tsx
import { useState, useEffect } from 'react';
import {getAllLessons, getLessonsByLevel, getLessonsByTopic} from '../lib/crud.ts';
import type { Lesson } from '../models/types.ts';

export default function LessonFilter() {
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

    return (
        <div>
            <div>
                <button onClick={() => setFilter('all')}>Alles</button>
                <button onClick={() => setFilter('level')}>Per Niveau</button>
                <button onClick={() => setFilter('topic')}>Per Onderwerp</button>
            </div>

            {filter === 'level' && (
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                </select>
            )}

            {filter === 'topic' && (
                <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                    <option value="basics">Basis</option>
                    <option value="verbs">Werkwoorden</option>
                    <option value="vocabulary">Woordenschat</option>
                </select>
            )}

            <div>
                {lessons.map(lesson => (
                    <div key={lesson.id}>{lesson.title}</div>
                ))}
            </div>
        </div>
    );
}