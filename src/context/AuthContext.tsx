// src/contexts/AuthContext.tsx
import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import {onAuthStateChanged, type User} from 'firebase/auth';
import {auth} from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    // internal flag to detect absence of provider when consumed from hooks
    __fromDefault?: true;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    __fromDefault: true,
});

export function useAuth() {
    return useContext(AuthContext);
}

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    const value = {
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}