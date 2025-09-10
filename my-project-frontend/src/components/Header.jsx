// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     FaRegBell,
//     FaRegHeart,
//     FaSearch,
//     FaShoppingCart,
//     FaBars,
//     FaTimes,
// } from "react-icons/fa";
// import { LogOut, User } from "lucide-react";

// import Avatar from "./Avatar.jsx";
// import { getProfile } from "../api/profileApi.js";

import { Link } from "react-router-dom";

export default function Header() {
    // const [user, setUser] = useState(null);
    // const navigate = useNavigate();

    // const [openMenu, setOpenMenu] = useState(null);
    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // const [searchQuery, setSearchQuery] = useState('');
    // let timeoutId;

    // // ✅ gọi API khi mount
    // useEffect(() => {
    //     getProfile()
    //         .then((u) => setUser(u))
    //         .catch(() => setUser(null));
    // }, []);

    // const handleMouseEnter = (menu) => {
    //     clearTimeout(timeoutId);
    //     setOpenMenu(menu);
    // };

    // const handleMouseLeave = () => {
    //     timeoutId = setTimeout(() => setOpenMenu(null), 250);
    // };

    // const handleLogout = () => {
    //     if (!confirm("Are you sure you want to logout?")) return;
    //     localStorage.removeItem("auth_token"); // xoá token
    //     setUser(null);
    //     navigate("/login");
    // };

    // const navigateToSearch = () => {
    //     if (!searchQuery.trim()) return;
    //     navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    // };

    return (
        // <header className="bg-white shadow-sm sticky top-0 z-50">
        //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        //         <div className="flex justify-between items-center py-3 md:py-4">
        //             {/* Logo */}
        //             <img
        //                 src="/images/logo.webp"
        //                 alt="Logo"
        //                 className="h-8 cursor-pointer"
        //                 onClick={() => navigate("/dashboard")}
        //             />

        //             {/* Desktop Menu */}
        //             <div className="hidden md:flex items-center flex-1 ml-6 gap-4">
        //                 {/* Explore */}
        //                 <div
        //                     className="relative"
        //                     onMouseEnter={() => handleMouseEnter("explore")}
        //                     onMouseLeave={handleMouseLeave}
        //                 >
        //                     <button className="px-3 py-2 text-sm text-gray-700  hover:text-purple-600 cursor-pointer hover:transition-colors">
        //                         Explore
        //                     </button>
        //                     {openMenu === "explore" && (
        //                         <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-md rounded-md z-50">
        //                             <ul className="text-sm text-gray-700">
        //                                 <li className="hover:bg-purple-100 p-2 cursor-pointer">Development</li>
        //                                 <li className="hover:bg-purple-100 p-2 cursor-pointer">Business</li>
        //                                 <li className="hover:bg-purple-100 p-2 cursor-pointer">Design</li>
        //                                 <li className="hover:bg-purple-100 p-2 cursor-pointer">Marketing</li>
        //                             </ul>
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Search */}
        //                 <div className="relative flex-1 min-w-0">
        //                     <FaSearch
        //                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        //                         onClick={navigateToSearch}
        //                     />
        //                     <input
        //                         type="text"
        //                         placeholder="Search for anything"
        //                         value={searchQuery}
        //                         onChange={(e) => setSearchQuery(e.target.value)}
        //                         onKeyDown={(e) => {
        //                             if (e.key === "Enter") {
        //                                 navigateToSearch();
        //                             }
        //                         }}
        //                         className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        //                     />

        //                 </div>
        //             </div>

        //             {/* Actions + Avatar */}
        //             <div className="hidden md:flex items-center space-x-4 ml-4">
        //                 <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer">
        //                     <FaRegHeart size={18} className="text-gray-600" />
        //                 </button>
        //                 <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer">
        //                     <FaShoppingCart size={18} className="text-gray-600" />
        //                 </button>
        //                 <button className="p-2 rounded-md hover:bg-purple-100 cursor-pointer">
        //                     <FaRegBell size={18} className="text-gray-600" />
        //                 </button>

        //                 {user ? (
        //                     <DropdownAvatar
        //                         name={user.name}
        //                         avatarUrl={user.avatar}
        //                         fullName={user.name}
        //                         email={user.email}
        //                         onLogout={handleLogout}
        //                     />
        //                 ) : (
        //                     <button
        //                         onClick={() => navigate("/login")}
        //                         className="px-4 py-2 rounded-md bg-purple-600 text-white"
        //                     >
        //                         Login
        //                     </button>
        //                 )}
        //             </div>

        //             {/* Mobile Hamburger */}
        //             <div className="md:hidden flex items-center">
        //                 <button
        //                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        //                     className="p-2 cursor-pointer"
        //                 >
        //                     {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        //                 </button>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Mobile Menu */}
        //     {mobileMenuOpen && (
        //         <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
        //             <ul className="flex flex-col px-4 py-2 space-y-2">
        //                 <li className="p-2 hover:bg-purple-100 cursor-pointer">Favorites</li>
        //                 <li className="p-2 hover:bg-purple-100 cursor-pointer">Cart</li>
        //                 {user ? (
        //                     <>
        //                         <li>
        //                             <button
        //                                 onClick={() => navigate("/profile")}
        //                                 className="p-2 hover:bg-purple-100 cursor-pointer w-full text-left"
        //                             >
        //                                 Profile
        //                             </button>
        //                         </li>
        //                         <li
        //                             className="p-2 hover:bg-purple-100 cursor-pointer"
        //                             onClick={handleLogout}
        //                         >
        //                             Logout
        //                         </li>
        //                     </>
        //                 ) : (
        //                     <li>
        //                         <button
        //                             onClick={() => navigate("/login")}
        //                             className="p-2 hover:bg-purple-100 cursor-pointer w-full text-left"
        //                         >
        //                             Login
        //                         </button>
        //                     </li>
        //                 )}
        //             </ul>
        //         </div>
        //     )}
        // </header>

        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" onClick={window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <span className="text-white font-bold text-lg">✦</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                EventSphere
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" className="text-purple-600 hover:text-purple-700 font-semibold relative group">
                            Home
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 transform scale-x-100 transition-transform duration-200"></span>
                        </Link>
                        <Link to="/event" className="text-gray-700 hover:text-purple-600 font-medium relative group transition-colors duration-200">
                            Event
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </Link>
                        <Link to="/about-us" className="text-gray-700 hover:text-purple-600 font-medium relative group transition-colors duration-200">
                            About Us
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button className="cursor-pointer text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-200">
                            Login
                        </button>
                        <button className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

// DropdownAvatar component
function DropdownAvatar({ name,     avatarUrl, fullName, email, onLogout }) {
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
            {/* Avatar */}
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleClick}
            >
                <Avatar name={name} avatarUrl={avatarUrl} />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-65 rounded-lg bg-white border border-gray-200 shadow-lg z-50">
                    <div className="px-3 py-3 border-b border-gray-200 flex items-center gap-3">
                        <Avatar name={name} avatarUrl={avatarUrl} size="2rem" />
                        <div>
                            <p className="font-semibold text-gray-800">{fullName}</p>
                            <p className="text-sm text-gray-500">{email}</p>
                        </div>
                    </div>
                    <ul className="text-sm text-gray-700">
                        <li>
                            <button
                                onClick={goToProfile}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-purple-100 cursor-pointer"
                            >
                                <User size={16} /> Profile
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-purple-100 cursor-pointer text-red-600"
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
