import {
    Home,
    Calendar,
    Users,
    Search,
    MapPin,
    Tag,
    Settings,
    CreditCard,
    Plus,
    FileText,
    HelpCircle,
    Shield,
    BookOpen,
} from "lucide-react";

import Header from "../components/Header";

const SitemapPage = () => {
    const siteLinks = [
        {
            title: "Main Pages",
            icon: <Home className="w-5 h-5" />,
            links: [
                { name: "Home", url: "/", description: "EventSphere homepage with featured events" },
                { name: "All Events", url: "/event", description: "Browse all available events" },
                { name: "About Us", url: "/about-us", description: "Learn more about EventSphere" },
                { name: "Contact", url: "/contact", description: "Get in touch with our team" },
            ],
        },
        {
            title: "User Authentication",
            icon: <Users className="w-5 h-5" />,
            links: [
                { name: "Login", url: "/login", description: "Sign in to your account" },
                { name: "Register", url: "/register", description: "Create a new account" },
                { name: "Forgot Password", url: "/user/forgot-password", description: "Reset your password" },
            ],
        },
        {
            title: "Event Categories",
            icon: <Tag className="w-5 h-5" />,
            links: [
                { name: "Technology Events", url: "/events/category/technology", description: "Tech conferences, workshops, and meetups" },
                { name: "Business Events", url: "/events/category/business", description: "Business conferences and networking events" },
                { name: "Education Events", url: "/events/category/education", description: "Educational workshops and seminars" },
                { name: "Health & Wellness", url: "/events/category/health", description: "Health and wellness events" },
                { name: "Entertainment", url: "/events/category/entertainment", description: "Entertainment and cultural events" },
                { name: "Sports & Fitness", url: "/events/category/sports", description: "Sports events and fitness activities" },
            ],
        },
        {
            title: "Event Discovery",
            icon: <Search className="w-5 h-5" />,
            links: [
                { name: "Search Events", url: "/search", description: "Search for events by keyword" },
                { name: "Upcoming Events", url: "/events/upcoming", description: "Events happening soon" },
                { name: "Today's Events", url: "/events/today", description: "Events happening today" },
                { name: "This Week", url: "/events/this-week", description: "Events happening this week" },
                { name: "Free Events", url: "/events/free", description: "Free events and activities" },
                { name: "Paid Events", url: "/events/paid", description: "Premium paid events" },
            ],
        },
        {
            title: "Location-Based",
            icon: <MapPin className="w-5 h-5" />,
            links: [
                { name: "Ho Chi Minh City", url: "/events/location/ho-chi-minh-city", description: "Events in Ho Chi Minh City" },
                { name: "Hanoi", url: "/events/location/hanoi", description: "Events in Hanoi" },
                { name: "Da Nang", url: "/events/location/da-nang", description: "Events in Da Nang" },
                { name: "Can Tho", url: "/events/location/can-tho", description: "Events in Can Tho" },
                { name: "Hai Phong", url: "/events/location/hai-phong", description: "Events in Hai Phong" },
            ],
        },
        {
            title: "User Dashboard",
            icon: <Settings className="w-5 h-5" />,
            links: [
                { name: "Dashboard", url: "/dashboard", description: "Your personal dashboard" },
                { name: "My Events", url: "/dashboard/events", description: "Events you've created" },
                { name: "My Bookings", url: "/dashboard/bookings", description: "Your event bookings" },
                { name: "Favorites", url: "/dashboard/favorites", description: "Your favorite events" },
                { name: "Profile Settings", url: "/dashboard/profile", description: "Manage your profile" },
                { name: "Notifications", url: "/dashboard/notifications", description: "Your notifications" },
            ],
        },
        {
            title: "Event Management",
            icon: <Plus className="w-5 h-5" />,
            links: [
                { name: "Create Event", url: "/create-event", description: "Create a new event" },
                { name: "Event Analytics", url: "/dashboard/analytics", description: "View event performance" },
                { name: "Manage Attendees", url: "/dashboard/attendees", description: "Manage event attendees" },
                { name: "Event Settings", url: "/dashboard/event-settings", description: "Configure event settings" },
            ],
        },
        {
            title: "Booking Process",
            icon: <CreditCard className="w-5 h-5" />,
            links: [
                { name: "Select Seats", url: "/event/*/seat", description: "Choose your seats" },
                { name: "Booking Details", url: "/event/*/booking", description: "Enter booking information" },
                { name: "Payment", url: "/event/*/payment", description: "Complete your payment" },
                { name: "Booking Confirmation", url: "/booking/confirmation", description: "Booking confirmation page" },
            ],
        },
    ];

    const handleLinkClick = (url) => {
        // In a real application, this would use React Router
        window.open(url, "_blank");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">EventSphere</span>{" "}
                                Sitemap
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Discover all the pages and features available on EventSphere. Find events, manage bookings, and explore everything our
                                platform has to offer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {siteLinks.reduce((total, section) => total + section.links.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Pages</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Tag className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{siteLinks.length}</div>
                            <div className="text-sm text-gray-600">Categories</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-600">Available</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">100%</div>
                            <div className="text-sm text-gray-600">Secure</div>
                        </div>
                    </div>

                    {/* Sitemap Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {siteLinks.map((section, sectionIndex) => (
                            <div
                                key={sectionIndex}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Section Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">{section.icon}</div>
                                        <div>
                                            <h2 className="text-xl font-bold">{section.title}</h2>
                                            <p className="text-purple-100 text-sm">{section.links.length} pages available</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Links List */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {section.links.map((link, linkIndex) => (
                                            <div key={linkIndex} className="group">
                                                <button
                                                    onClick={() => handleLinkClick(link.url)}
                                                    className="cursor-pointer w-full text-left p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group-hover:shadow-md"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                                {link.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                                                            <code className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                                                                {link.url}
                                                            </code>
                                                        </div>
                                                        <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <svg
                                                                className="w-5 h-5 text-purple-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SitemapPage;
