import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {FaRegBell, FaRegHeart, FaSearch, FaShoppingCart, FaBars, FaTimes} from "react-icons/fa";
import { LogOut, User } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    let timeoutId;

    const handleMouseEnter = (menu) => {
        clearTimeout(timeoutId);
        setOpenMenu(menu);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => setOpenMenu(null), 250);
    };

    const handleLogout = () => {
        if (!confirm("Are you sure you want to logout?")) return
        logout();
        navigate("/login");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3 md:py-4">
                    {/* Logo */}
                    <img
                        src="/images/logo.webp"
                        alt="Udemy Logo"
                        className="h-8 cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                    />

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center flex-1 ml-6 gap-4">
                        {/* Explore */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter("explore")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className="px-3 py-2 text-sm font-medium hover:text-purple-600 cursor-pointer hover:transition-colors">
                                Explore
                            </button>
                            {openMenu === "explore" && (
                                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md z-50">
                                    <ul className="text-sm text-gray-700">
                                        <li className="hover:bg-purple-100 p-2 cursor-pointer">Development</li>
                                        <li className="hover:bg-purple-100 p-2 cursor-pointer">Business</li>
                                        <li className="hover:bg-purple-100 p-2 cursor-pointer">Design</li>
                                        <li className="hover:bg-purple-100 p-2 cursor-pointer">Marketing</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 min-w-0">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for anything"
                                className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Actions + Avatar */}
                    <div className="hidden md:flex items-center space-x-4 ml-4">
                        <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer hover:transition-colors">
                            <FaRegHeart size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer hover:transition-colors">
                            <FaShoppingCart size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer hover:transition-colors">
                            <FaRegBell size={18} className="text-gray-600" />
                        </button>

                        <DropdownAvatar
                            name={user?.name || "User"}
                            avatarUrl={user?.avatarUrl || null}
                            fullName={user?.name || "User"}
                            email={user?.email || ""}
                            isVerified={!!user?.email_verified_at}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 cursor-pointer"
                        >
                            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
                    <ul className="flex flex-col px-4 py-2 space-y-2">
                        <li className="p-2 hover:bg-purple-100 cursor-pointer">Favorites</li>
                        <li className="p-2 hover:bg-purple-100 cursor-pointer">Cart</li>
                        <li>
                            <button onClick={() => navigate("/profile")} className="p-2 hover:bg-purple-100 cursor-pointer w-full text-left">Profile</button></li>
                        <li className="p-2 hover:bg-purple-100 cursor-pointer" onClick={handleLogout}>Logout</li>
                    </ul>
                </div>
            )}
        </header>
    );
}

// DropdownAvatar component
function DropdownAvatar({ name, avatarUrl, fullName, email, onLogout }) {
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

    const goToProfile = () => {
        navigate("/profile");
        setOpen(false);
    };

    return (
        <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-2 cursor-pointer">
                <Avatar name={name} avatarUrl={avatarUrl} />
            </div>
            {open && (
                <div className="absolute right-0 mt-2 w-65 rounded-lg bg-white border border-gray-200 shadow-lg z-50">
                    <div className="px-3 py-3 border-b border-gray-200 flex items-center gap-3">
                        <Avatar name={name} avatarUrl={avatarUrl} size="2rem"/>
                        <div>
                            <p className="font-semibold text-gray-800">{fullName}</p>
                            <p className="text-sm text-gray-500">{email}</p>
                        </div>
                    </div>
                    <ul className="text-sm text-gray-700">
                        <li>
                            <button onClick={goToProfile} className="flex items-center gap-2 w-full px-3 py-2 hover:bg-purple-100 cursor-pointer hover:transition-colors">
                                <User size={16} /> Profile
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-purple-100 cursor-pointer hover:transition-colors text-red-600"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
