import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signInWithGitHub, signOut, user } = useAuth();

    const displayName = user?.user_metadata.user_name || user?.email;
    return (
        <nav className="fixed top-0 w-full z-40 bg-[#503D42] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="font-mono text-xl font-bold text-white">
                        dev<span className="text-sky-600">.io</span>
                    </Link>

                    {/* desktop */}
                    <div className="hidden md:flex items-center space-x-0">
                        <Link
                            to="/"
                            className="text-white hover:text-sky-600 transition-colors px-4 relative"
                        >
                            Home
                        </Link>
                        <span className="h-6 w-px bg-gray-300 mx-1" />
                        {user && (
                            <>
                                <Link
                                    to="/create"
                                    className="text-white hover:text-sky-600 transition-colors px-4 relative"
                                >
                                    Create Post
                                </Link>
                                <span className="h-6 w-px bg-gray-300 mx-1" />
                            </>
                        )}
                        <Link
                            to="/communities"
                            className="text-white hover:text-sky-600 transition-colors px-4 relative"
                        >
                            Communities
                        </Link>
                        <span className="h-6 w-px bg-gray-300 mx-1" />
                        {user && (
                            <Link
                                to="/community/create"
                                className="text-white hover:text-sky-600 transition-colors px-4 relative"
                            >
                                Create Community
                            </Link>
                        )}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center justify-end">
                        {user ? (
                            <div className="flex flex-row items-center space-x-4">
                                {user.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full object-cover hover:opacity-80 transition-opacity duration-200"
                                    />
                                )}
                                <span className="text-white font-bold">{displayName}</span>
                                <button
                                    onClick={signOut}
                                    className="self-center flex items-center justify-center text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                                    aria-label="Logout"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={signInWithGitHub}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                            >
                                Sign in with GitHub
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="text-gray-300 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {menuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                            Home
                        </Link>
                        {user && (
                            <Link
                                to="/create"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Create Post
                            </Link>
                        )}
                        <Link
                            to="/communities"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                            Communities
                        </Link>
                        {user && (
                            <Link
                                to="/community/create"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                            >
                                Create Community
                            </Link>
                        )}
                        <div className="mt-4 border-t border-gray-700 pt-4 flex flex-col items-start space-y-2">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-3 mb-2">
                                        {user.user_metadata?.avatar_url && (
                                            <img
                                                src={user.user_metadata.avatar_url}
                                                alt="User Avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                        <span className="text-white font-bold text-base">{displayName}</span>
                                    </div>
                                    <button
                                        onClick={() => { setMenuOpen(false); signOut(); }}
                                        className="w-full text-white bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition-colors duration-200 text-center"
                                        aria-label="Logout"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setMenuOpen(false); signInWithGitHub(); }}
                                    className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors duration-200 text-left"
                                >
                                    Sign in with GitHub
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};