import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getAuthErrorMessage, type AuthError } from '../lib/auth';
import * as React from "react";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validatie
        if (formData.password !== formData.confirmPassword) {
            setError('Wachtwoorden komen niet overeen');
            return;
        }

        if (formData.password.length < 6) {
            setError('Wachtwoord moet minimaal 6 karakters zijn');
            return;
        }

        if (formData.displayName.length < 2) {
            setError('Naam moet minimaal 2 karakters zijn');
            return;
        }

        setLoading(true);

        try {
            await registerUser(formData.email, formData.password, formData.displayName);
            navigate('/dashboard');
        } catch (err) {
            setError(getAuthErrorMessage(err as AuthError));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Maak een account</h1>
                    <p className="text-gray-600 mt-2">Begin vandaag nog met Fries leren</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p className="font-medium">Fout bij registreren</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                                Naam
                            </label>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                value={formData.displayName}
                                onChange={handleChange}
                                required
                                minLength={2}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Jouw naam"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="jouw@email.nl"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Wachtwoord
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Minimaal 6 karakters"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Gebruik minimaal 6 karakters
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Bevestig wachtwoord
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Herhaal wachtwoord"
                            />
                        </div>

                        <div className="flex items-start">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                Ik ga akkoord met de{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                                    algemene voorwaarden
                                </a>{' '}
                                en het{' '}
                                <a href="#" className="text-indigo-600 hover:text-indigo-700">
                                    privacybeleid
                                </a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                        >
                            {loading ? 'Account aanmaken...' : 'Registreren'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Heb je al een account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}