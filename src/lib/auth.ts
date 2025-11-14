import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    type User
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './crud';

export interface AuthError {
    code: string;
    message: string;
}

export function getAuthErrorMessage(error: AuthError): string {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Dit e-mailadres is al in gebruik';
        case 'auth/invalid-email':
            return 'Ongeldig e-mailadres';
        case 'auth/operation-not-allowed':
            return 'Deze operatie is niet toegestaan';
        case 'auth/weak-password':
            return 'Wachtwoord is te zwak. Gebruik minimaal 6 karakters';
        case 'auth/user-disabled':
            return 'Dit account is uitgeschakeld';
        case 'auth/user-not-found':
            return 'Geen account gevonden met dit e-mailadres';
        case 'auth/wrong-password':
            return 'Onjuist wachtwoord';
        case 'auth/invalid-credential':
            return 'Ongeldige inloggegevens';
        case 'auth/too-many-requests':
            return 'Te veel pogingen. Probeer het later opnieuw';
        case 'auth/network-request-failed':
            return 'Netwerkfout. Controleer je internetverbinding';
        default:
            return 'Er is een fout opgetreden. Probeer het opnieuw';
    }
}

export async function registerUser(
    email: string,
    password: string,
    displayName: string
): Promise<User> {
    try {
        // Maak Firebase Auth gebruiker aan
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Maak gebruikersprofiel in Firestore
        await createUserProfile(user.uid, {
            email: user.email!,
            displayName: displayName,
            createdAt: new Date(),
            lastActive: new Date(),
            nativeLanguage: 'nl',
            targetLanguage: 'fy',
            totalXP: 0,
            currentLevel: 1,
            currentStreak: 0,
            longestStreak: 0,
            totalLessonsCompleted: 0,
            totalExercisesCompleted: 0
        });

        return user;
    } catch (error) {
        console.error('Fout bij registreren gebruiker:', error);
        throw error; // Added to propagate the error
    }
}

// Login gebruiker
export async function loginUser(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Fout bij inloggen gebruiker:', error);
        throw error; // Added to propagate the error
    }
}

// Logout gebruiker
export async function logoutUser(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Fout bij uitloggen gebruiker:', error);
    }
}

// Wachtwoord reset
export async function resetPassword(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Fout bij wachtwoord reset:', error);
    }
}