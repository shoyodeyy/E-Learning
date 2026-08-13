import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-gray-300">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">About</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about-us" className="hover:text-white transition-colors duration-200">
                                    About us
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://about.udemy.com/company/?locale=en-us#contact"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Contact us
                                </a>
                            </li>
                            <li>
                                <a href="https://blog.udemy.com/" className="hover:text-white transition-colors duration-200">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Discover Udemy Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Discover Udemy</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Plans and Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Affiliate
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Help and Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Accessibility Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal & Accessibility</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Accessibility statement
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Privacy policy
                                </a>
                            </li>
                            <li>
                                <Link to="/sitemap" href="#" className="hover:text-white transition-colors duration-200">
                                    Sitemap
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors duration-200">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom footer */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    {/* Logo and Copyright */}
                    <div className="flex items-center justify-center space-x-4">
                        <Link to="/" onClick={window.scrollTo({ top: 0, behavior: "smooth" })} className="cursor-pointer flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <span className="text-white font-bold text-lg">✦</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                EventSphere
                            </span>
                        </Link>
                        <span className="text-gray-400 text-sm">© {currentYear} Udemy, Inc.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
