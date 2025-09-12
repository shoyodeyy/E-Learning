import { useState, useEffect, useRef } from "react";
import { LogOut, User, Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Avatar from "./Avatar.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();
    const mobileMenuRef = useRef(null);
    const { user, logout } = useAuth();

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/event", label: "Event" },
        { path: "/about-us", label: "About Us" },
        { path: "/media-gallery", label: "Media Gallery" },
    ];

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden"; // Prevent body scroll when menu is open
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        setConfirmOpen(true);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link
                                to="/"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                className="cursor-pointer flex items-center space-x-2 sm:space-x-3"
                            >
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                    <span className="text-white font-bold text-sm sm:text-lg">✦</span>
                                </div>
                                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    EventSphere
                                </span>
                            </Link>
                        </div>

                        {/* Desktop & Tablet Navigation */}
                        <nav className="hidden lg:flex space-x-8">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`${
                                            isActive ? "text-purple-600 font-semibold" : "text-gray-700 font-medium hover:text-purple-600"
                                        } relative group transition-colors duration-200`}
                                    >
                                        {item.label}
                                        <span
                                            className={`absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 transform transition-transform duration-200 ${
                                                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        ></span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop Auth Buttons / Avatar */}
                        <div className="hidden lg:flex items-center space-x-3 lg:space-x-4">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="cursor-pointer text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200 text-sm lg:text-base"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm lg:text-base"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <DropdownAvatar
                                    name={user.name}
                                    avatarUrl={user.avatar}
                                    fullName={user.name}
                                    email={user.email}
                                    onLogout={handleLogout}
                                />
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center space-x-2 sm:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                aria-label="Toggle mobile menu"
                            >
                                {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
                            </button>
                        </div>

                        {/* Tablet Menu Button (for lg breakpoint) */}
                        <div className="hidden sm:flex lg:hidden items-center">
                            <button
                                onClick={toggleMobileMenu}
                                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ml-2"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {/* Mobile/Tablet Overlay Menu */}
            <div
                className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
                        mobileMenuOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    ref={mobileMenuRef}
                    className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ${
                        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">✦</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                EventSphere
                            </span>
                        </div>
                        <button onClick={toggleMobileMenu} className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <X size={20} className="text-gray-700" />
                        </button>
                    </div>

                    {/* User Info (if logged in) */}
                    {user && (
                        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <Avatar name={user.name} avatarUrl={user.avatar} size="2.5rem" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="py-4">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-200 ${
                                            isActive
                                                ? "text-purple-600 bg-purple-50 border-r-2 border-purple-600"
                                                : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Actions */}
                        {user ? (
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
                                <button
                                    onClick={() => {
                                        if (user.role === "participant") navigate("/user/profile");
                                        else if (user.role === "organizer") navigate("/organizer/profile");
                                        setMobileMenuOpen(false);
                                    }}
                                    className="cursor-pointer flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <User size={20} className="mr-3" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => {
                                        if (user.role === "participant") navigate("/user/dashboard");
                                        else if (user.role === "organizer") navigate("/organizer/dashboard");
                                        setMobileMenuOpen(false);
                                    }}
                                    className=" cursor-pointer flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <LayoutDashboard size={20} className="mr-3" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                                >
                                    <LogOut size={20} className="mr-3" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 px-4">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 px-4 border border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmDialog
                open={confirmOpen}
                message="Are you sure you want to logout?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => {
                    logout(), navigate("/");
                    setConfirmOpen(false);
                }}
            />
        </>
    );
}

// DropdownAvatar component
function DropdownAvatar({ name, avatarUrl, fullName, email, onLogout }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    const toggleClick = () => {
        setOpen((prev) => !prev);
    };

    const goToProfile = () => {
        navigate("/user/profile");
        setOpen(false);
    };

    const goToDashboard = () => {
        if (user.role === "organizer") {
            navigate("/organizer/dashboard");
        } else if (user.role === "admin") {
            navigate("/admin/dashboard");
        } else navigate("/user/dashboard");
        setOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {/* Avatar */}
            <div
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleClick}
            >
                <Avatar name={name} avatarUrl={avatarUrl} />
                <span>{name}</span>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white border border-gray-200 shadow-lg z-50 transform transition-all duration-200">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                        <Avatar name={name} avatarUrl={avatarUrl} size="2rem" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{fullName}</p>
                            <p className="text-sm text-gray-500 truncate">{email}</p>
                        </div>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={goToProfile}
                            className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        >
                            <User size={16} />
                            Profile
                        </button>
                        <button
                            onClick={goToDashboard}
                            className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </button>
                        <button
                            onClick={onLogout}
                            className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
