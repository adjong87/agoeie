// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser.ts';
import { getTopicProgress } from '../lib/crud';
import type {TopicProgress} from "../models/types.ts";

export default function Dashboard() {
    const { user } = useAuth();
    const { profile, loading } = useUser();
    const [topicsProgress, setTopicsProgress] = useState<Record<string, TopicProgress>>({});

    useEffect(() => {
        async function loadTopicProgress() {
            if (!user) return;

            const topics = ['basics', 'verbs', 'vocabulary', 'nouns', 'sentence_structure'];
            const progressData: Record<string, TopicProgress> = {};

            for (const topic of topics) {
                const data = await getTopicProgress(user.uid, topic);
                if (data) {
                    progressData[topic] = data;
                }
            }

            setTopicsProgress(progressData);
        }

        if (profile) {
            loadTopicProgress();
        }
    }, [user, profile]);

    if (loading) return <div>Dashboard laden...</div>;
    if (!profile) return <div>Log in om je dashboard te zien</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600">Level</h3>
                    <p className="text-3xl font-bold">{profile.currentLevel}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600">Total XP</h3>
                    <p className="text-3xl font-bold">{profile.totalXP}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600">Streak</h3>
                    <p className="text-3xl font-bold">{profile.currentStreak} 🔥</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-gray-600">Lessen</h3>
                    <p className="text-3xl font-bold">{profile.totalLessonsCompleted}</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Voortgang per onderwerp</h2>
            <div className="space-y-4">
                {Object.entries(topicsProgress).map(([topicId, progress]) => (
                    <div key={topicId} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold capitalize">{topicId}</h3>
                            <span className="text-sm text-gray-600">
                {Math.round(progress.masteryLevel * 100)}%
              </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress.masteryLevel * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Gemiddelde score: {progress.averageScore}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}