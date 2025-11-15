import {useContext, useEffect, useState} from 'react';
import {onAuthStateChanged, type User} from 'firebase/auth';
import {auth} from '../lib/firebase';
import {AuthContext} from '../context/AuthContext';

export function useAuth() {
    // Prefer context if an AuthProvider is present to avoid duplicate listeners
    const ctx = useContext(AuthContext);
    if (!ctx.__fromDefault) {
        return ctx;
    }

    // Fallback: standalone usage without Provider
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    return {user, loading};
}