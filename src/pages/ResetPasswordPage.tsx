import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword, getAuthErrorMessage, type AuthError } from '../lib/auth';
import * as React from "react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Wachtwoord vergeten?</h1>
                    <p className="text-gray-600 mt-2">
                        Geen probleem! Voer je email in en we sturen je een reset link.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                            <p className="font-medium">Email verzonden!</p>
                            <p className="text-sm mt-1">
                                Controleer je inbox voor instructies om je wachtwoord te resetten.
                            </p>
                        </div>
                    )}

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email adres
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="jouw@email.nl"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                            >
                                {loading ? 'Email versturen...' : 'Verstuur reset link'}
                            </button>
                        </form>
                    ) : (
                        <Link
                            to="/login"
                            className="block w-full py-3 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            Terug naar login
                        </Link>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-700">
                            ← Terug naar login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}