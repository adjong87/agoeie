// src/hooks/useUser.ts
import { useEffect, useState } from 'react';
import { getUserProfile } from '../lib/crud';
import type {UserProfile} from "../models/types.ts";
import {useAuth} from "./useAuth.ts";

export function useUser() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            try {
                const data = await getUserProfile(user.uid);
                setProfile(data);
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [user]);

    const refreshProfile = async () => {
        if (!user) return;
        const data = await getUserProfile(user.uid);
        setProfile(data);
    };

    return { profile, loading, refreshProfile };
}