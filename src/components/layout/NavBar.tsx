import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx'
import { logoutUser } from '../../lib/auth';
import { useState } from 'react';

export default function Navbar() {
    const { user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold">
                        A Goeie 🇳🇱
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-indigo-200 transition">
                            Home
                        </Link>
                        <Link to="/lessons" className="hover:text-indigo-200 transition">
                            Lessen
                        </Link>
                        <Link to="/demo" className="hover:text-indigo-200 transition">
                            Demo
                        </Link>

                        {user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-indigo-200 transition">
                                    Dashboard
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 hover:text-indigo-200 transition"
                                    >
                                        <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center">
                                            {user.email?.[0].toUpperCase()}
                                        </div>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-800">
                                            <div className="px-4 py-2 border-b">
                                                <p className="text-sm font-medium">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                            >
                                                Uitloggen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="hover:text-indigo-200 transition">
                                Inloggen
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}