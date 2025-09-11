import { useState } from "react";
import { Users, Target, Award, Globe, Heart, Star, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
    const [activeTeamMember, setActiveTeamMember] = useState(0);

    // Mock data
    const stats = [
        { number: "1K+", label: "Events Hosted", icon: "🎉" },
        { number: "1M+", label: "Happy Attendees", icon: "😊" },
        { number: "100+", label: "Partner Organizations", icon: "🤝" },
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Innovation First",
            description: "We constantly push the boundaries of event technology to create unforgettable experiences.",
            color: "from-purple-500 to-purple-600",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community Driven",
            description: "Building connections and fostering communities is at the heart of everything we do.",
            color: "from-pink-500 to-pink-600",
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Excellence Always",
            description: "We maintain the highest standards in event planning, execution, and customer service.",
            color: "from-indigo-500 to-indigo-600",
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Impact",
            description: "Creating meaningful events that bring people together from around the world.",
            color: "from-cyan-500 to-cyan-600",
        },
    ];

    const teamMembers = [
        {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
            bio: "With over 15 years in event management, Sarah founded EventSphere to revolutionize how people connect through events.",
            linkedin: "#",
        },
        {
            name: "Michael Chen",
            role: "CTO",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            bio: "Michael leads our technology team, bringing innovative solutions to event management and user experience.",
            linkedin: "#",
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
            bio: "Emily ensures flawless execution of every event, managing operations across multiple continents.",
            linkedin: "#",
        },
        {
            name: "David Kim",
            role: "Head of Marketing",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            bio: "David crafts compelling stories that connect our events with audiences worldwide.",
            linkedin: "#",
        },
    ];

    const milestones = [
        {
            year: "2018",
            title: "Company Founded",
            description: "EventSphere was born with a vision to transform the event industry",
        },
        {
            year: "2019",
            title: "First Major Event",
            description: "Hosted our first international tech conference with 5,000 attendees",
        },
        {
            year: "2020",
            title: "Virtual Pivot",
            description: "Successfully transitioned to virtual events during global challenges",
        },
        {
            year: "2021",
            title: "Global Expansion",
            description: "Expanded operations to 15 countries worldwide",
        },
        {
            year: "2023",
            title: "AI Integration",
            description: "Launched AI-powered event matching and recommendation system",
        },
        {
            year: "2024",
            title: "Sustainability Focus",
            description: "Committed to carbon-neutral events and sustainable practices",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
                    <div
                        className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-300/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                            <span className="text-sm font-semibold text-white">✨ About EventSphere</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                            Connecting People
                            <br />
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Through Events</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                            We're passionate about creating extraordinary experiences that bring people together, foster innovation, and build lasting
                            connections across the globe.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <Link to="/event" className="cursor-pointer bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                                <span>Join Our Team</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/" className="cursor-pointer bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-xl font-bold transition-all duration-200">
                                <span>Home</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative -mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                                <Heart className="w-4 h-4 text-purple-600 mr-2" />
                                <span className="text-sm font-semibold text-purple-600">Our Mission</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Empowering Connections Through
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Innovation</span>
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                At EventSphere, we believe that the most powerful innovations happen when people come together. Our mission is to
                                create seamless, engaging, and memorable event experiences that foster meaningful connections and drive positive
                                change in communities worldwide.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Create inclusive and accessible events for everyone",
                                "Leverage cutting-edge technology for better experiences",
                                "Build sustainable and environmentally conscious events",
                                "Foster global communities and knowledge sharing",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl transform rotate-3"></div>
                        <img
                            src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop"
                            alt="Team collaboration"
                            className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                            <Star className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold text-purple-600">Our Values</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">What Drives Us Forward</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our core values shape every decision we make and every event we create
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                        <span className="text-sm font-semibold text-purple-600">🚀 Our Journey</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Milestones That Define Us</h2>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => {
                            const { ref, inView } = useInView({
                                triggerOnce: true,
                                threshold: 0.2,
                            });

                            return (
                                <motion.div
                                    ref={ref}
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                            <div className="text-2xl font-bold text-purple-600 mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-lg"></div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
                            <Users className="w-4 h-4 text-purple-600 mr-2" />
                            <span className="text-sm font-semibold text-purple-600">Meet Our Team</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">The People Behind the Magic</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our diverse team of passionate professionals brings together expertise from across the globe
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                                onMouseEnter={() => setActiveTeamMember(index)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {/* <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Create Something Amazing Together?</h2>
                    <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of organizations worldwide who trust EventSphere to bring their visions to life
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="cursor-pointer bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                            Start Your Event
                        </button>
                        <button className="cursor-pointer bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-xl font-bold transition-all duration-200">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default AboutUsPage;
