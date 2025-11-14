import {useEffect, useState} from 'react';
import {getTopicProgress, getUserProfile} from '../lib/crud.ts';
import type {TopicProgress, UserProfile} from "../models/types.ts";

export default function UserDashboard({ userId }: { userId: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [topicsProgress, setTopicsProgress] = useState<Record<string, TopicProgress>>({});

    useEffect(() => {
        async function loadUserData() {
            // Haal profiel op
            const profileData = await getUserProfile(userId);
            setProfile(profileData);

            // Haal voortgang per topic op
            const topics = ['basics', 'verbs', 'vocabulary', 'nouns', 'sentence_structure'];
            const progressData: Record<string, TopicProgress> = {};

            for (const topic of topics) {
                const topicData = await getTopicProgress(userId, topic);
                if (topicData) {
                    progressData[topic] = topicData;
                }
            }

            setTopicsProgress(progressData);
        }

        loadUserData();
    }, [userId]);

    if (!profile) return <div>Laden...</div>;

    return (
        <div>
            <h1>Welkom, {profile.displayName}!</h1>
            <div>
                <p>Level: {profile.currentLevel}</p>
                <p>XP: {profile.totalXP}</p>
                <p>Streak: {profile.currentStreak} dagen 🔥</p>
                <p>Lessen voltooid: {profile.totalLessonsCompleted}</p>
            </div>

            <h2>Voortgang per onderwerp</h2>
            {Object.entries(topicsProgress).map(([topicId, progress]) => (
                <div key={topicId}>
                    <h3>{topicId}</h3>
                    <progress value={progress.masteryLevel} max={1} />
                    <span>{Math.round(progress.masteryLevel * 100)}%</span>
                    <p>Gemiddelde score: {progress.averageScore}%</p>
                </div>
            ))}
        </div>
    );
}