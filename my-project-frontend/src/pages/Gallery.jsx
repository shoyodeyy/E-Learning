import React, {useState, useEffect} from 'react';
import {Facebook, Twitter, Instagram} from 'lucide-react';
import {motion} from 'framer-motion';
import Header from "../components/Header.jsx";
import axios from "axios";
import {apiUrl} from "../services/http.jsx";
import Loading from "../components/Loading.jsx";

// RandomBlob component from homepage
function RandomBlob({className, color}) {
    const [target, setTarget] = useState({x: 0, y: 0});

    useEffect(() => {
        const interval = setInterval(() => {
            setTarget({
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            animate={{x: target.x, y: target.y}}
            transition={{duration: 1, ease: "linear"}}
            className={`absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${className}`}
            style={{backgroundColor: color}}
        />
    );
}

const EventSphereGallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [user, setUser] = useState([]);
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await axios.get(`${apiUrl}/media`);
                setMediaItems(res.data.data);
            } catch (err) {
                console.error("Error fetching media:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    // Define categories with count
    const categories = [
        { id: "all", name: "All", count: mediaItems.length },
        ...Array.from(new Set(mediaItems.map(item => item.event.category)))
            .map(category => ({
                id: category,
                name: category,
                count: mediaItems.filter(item => item.event.category === category).length
            }))
    ];

    // Filter media items based on selected category
    const filteredMedia = selectedCategory === 'all'
        ? mediaItems
        : mediaItems.filter(item => item.event.category === selectedCategory);

    const toggleMediaSelection = (id) => {
        setSelectedMedia(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSaveSelected = () => {
        if (selectedMedia.length === 0) {
            alert("Media chua dc chon!");
            return;
        }
        alert("Media duoc chon: " + selectedMedia.join(", "));
    };

    const MediaCard = ({item, index}) => (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: index * 0.1}}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-purple-100"
        >
            {/* Media Thumbnail */}
            <div className="relative overflow-hidden">
                <img
                    src={`http://localhost:8000${item.file_url}`}
                    alt={item.caption}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Selection checkbox */}
                {user?.role === "participant" && (
                    <div className="absolute top-3 left-3">
                        <input
                            type="checkbox"
                            checked={selectedMedia.includes(item.id)}
                            onChange={() => toggleMediaSelection(item.id)}
                            className="w-5 h-5 accent-purple-600"
                        />
                    </div>
                )}

                {/* Type badge */}
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg ${
                        item.file_type === 'video' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}>
                        {item.file_type === 'video' ? '📹 Video' : '🖼️ Image'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                    {item.caption}
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xs">📅</span>
                        </div>
                        <span className="font-medium">{item.event_year}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <div className="px-4 py-2 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-xs">🏷️ {item.department}</span>
                        </div>
                        <span
                            className="font-medium">{categories.find(cat => cat.id === item.category)?.name || item.category}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-indigo-50">
            <Header />

            {/* Hero Section */}
            <section
                className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-16 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <RandomBlob className="-top-40 -right-40" color="#c084fc" />
                    <RandomBlob className="-bottom-40 -left-40" color="#f9a8d4" />
                    <RandomBlob className="top-40 left-40" color="#a5b4fc" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center space-y-6">
                        <div
                            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                            <span className="text-sm font-semibold text-purple-600">📸 Media Gallery</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            Explore Our
                            <br />
                            <span
                                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Media Collection
              </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Discover amazing photos and videos from events across campus. Filter by category, event,
                            date, or media type.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 mb-12">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:text-purple-600 border-2 border-purple-100 hover:border-purple-300'
                                }`}
                            >
                                {category.name}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                    selectedCategory === category.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-purple-100 text-purple-600'
                                }`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Save Selected Button */}
                    {user?.role === "participant" && selectedMedia.length > 0 && (
                        <button
                            onClick={handleSaveSelected}
                            className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                        >
                            💾 Save Selected Media
                        </button>
                    )}
                </div>

                {loading ? <Loading /> : (
                    <>
                        {/* Media Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredMedia.map((item, index) => (
                                <MediaCard key={index} item={item} index={index} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredMedia.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <span className="text-6xl">📷</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
                                <p className="text-gray-500">Try selecting a different category</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex space-x-6 mb-4 sm:mb-0">
                            <a href="#"
                               className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200">About</a>
                            <a href="#"
                               className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200">Resources</a>
                            <a href="#"
                               className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200">Contact</a>
                        </div>

                        <div className="flex space-x-4">
                            <a href="#"
                               className="text-purple-400 hover:text-purple-600 transition-colors duration-200 p-2 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#"
                               className="text-purple-400 hover:text-purple-600 transition-colors duration-200 p-2 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#"
                               className="text-purple-400 hover:text-purple-600 transition-colors duration-200 p-2 bg-purple-50 rounded-lg hover:bg-purple-100">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default EventSphereGallery;