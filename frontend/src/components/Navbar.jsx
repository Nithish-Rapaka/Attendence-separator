import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import img from '../assets/navlogo.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/signin');
    };

    return (
        <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img className="w-12 h-12 mr-3" src={img} alt="logo" />
                        
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/home" className="hover:text-green-400 transition duration-200">Home</Link>
                        <Link to="/about" className="hover:text-green-400 transition duration-200">About</Link>
                        <Link to="/dashboard" className="hover:text-green-400 transition duration-200">Dashboard</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/signin" className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-200">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition duration-200">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                Log Out
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-gray-700 px-4 pb-4 space-y-2 transition-all duration-300">
                    <Link to="/home" className="block py-2 hover:text-green-400">Home</Link>
                    <Link to="/about" className="block py-2 hover:text-green-400">About</Link>
                    <Link to="/dashboard" className="block py-2 hover:text-green-400">Dashboard</Link>

                    {!isLoggedIn ? (
                        <>
                            <Link to="/signin" className="block py-2 hover:text-blue-300">Sign In</Link>
                            <Link to="/signup" className="block py-2 hover:text-blue-300">Sign Up</Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full text-left py-2 hover:text-red-500 transition duration-200"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
