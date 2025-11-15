import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx'
import { logoutUser } from '../../lib/auth';
import { useState } from 'react';
import logo from '../../assets/logo.png';

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
        <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
            {/* Full-width bar with three zones: left (logo), center (links), right (user) */}
            <div className="w-full h-16 flex items-center justify-between px-0">
                {/* Left: Logo (near left edge) */}
                <div className="flex items-center pl-2">
                    <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="inline-block"
                            style={{ height: '2.5rem', width: 'auto', maxHeight: '3rem' }}
                        />
                        <span className="hidden sm:inline">A Goeie</span>
                    </Link>
                </div>

                {/* Center: Navigation links */}
                <div className="hidden sm:flex flex-1 items-center justify-center gap-6">
                    <Link to="/" className="hover:text-blue-200 transition">
                        Home
                    </Link>
                    <Link to="/lessons" className="hover:text-blue-200 transition">
                        Lessen
                    </Link>
                    <Link to="/demo" className="hover:text-blue-200 transition">
                        Demo
                    </Link>
                    {user && (
                        <Link to="/dashboard" className="hover:text-blue-200 transition">
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Right: User/login (near right edge) */}
                <div className="flex items-center justify-end gap-4 pr-2 relative">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 hover:text-blue-200 transition"
                                aria-haspopup="menu"
                                aria-expanded={showDropdown}
                            >
                                <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center font-semibold">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 text-gray-800">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium truncate">{user.email}</p>
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
                    ) : (
                        <Link to="/login" className="hover:text-blue-200 transition">
                            Inloggen
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}