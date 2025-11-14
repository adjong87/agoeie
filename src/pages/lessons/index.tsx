import { useEffect, useState } from 'react';
import { getAllLessons } from '../../lib/crud';
import type {Lesson} from "../../models/types.ts";

export default function LessonsOverview() {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        async function loadLessons() {
            const allLessons = await getAllLessons();
            setLessons(allLessons);
        }
        loadLessons();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map(lesson => (
                <div key={lesson.id} className="border p-4 rounded">
                    <h2>{lesson.title}</h2>
                    <p>{lesson.description}</p>
                    <span>Level: {lesson.level}</span>
                    <span>XP: {lesson.xpReward}</span>
                    <button>Start Les</button>
                </div>
            ))}
        </div>
    );
}