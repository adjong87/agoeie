// contexts/UserContext.tsx
import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '../lib/crud.ts';
import type { UserProfile } from '../models/types.ts'

const UserContext = createContext<{
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth(); // Firebase Auth user
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshProfile() {
        if (!user) return;

        const data = await getUserProfile(user.uid);
        setProfile(data);
    }

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            await refreshProfile();
            setLoading(false);
        }

        if (user) {
            loadProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ profile, loading, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
}