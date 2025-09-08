export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-white to-purple-50 pt-8 px-4">
                <div className="max-w-7xl mx-auto flex items-center">
                    <div className="flex-1 max-w-2xl">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Welcome to where possibilities begin
                        </h1>
                    </div>
                    <div className="flex-1 relative">
                        <img
                            src="/images/about-us/about-homepage-hero-jan-2024.png"
                            alt="Professional woman"
                            className="z-10 w-full max-w-lg"
                        />
                    </div>
                </div>
            </section>

            {/* News Banner */}
            <section className="bg-gray-900 py-4">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <a href="https://about.udemy.com/press-releases/"
                       className="text-white font-extrabold hover:underline hover:underline-offset-4">Check out our
                        latest company news!</a>
                </div>
            </section>

            {/* Skills Section */}
            <section className="py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-[40px] font-bold text-gray-900 mb-4">Skills are the key to unlocking
                        potential</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Whether you want to learn a new skill, train your teams, or share what you know with the world,
                        you're in
                        the right place. As a leader in online learning, we're here to help you achieve your goals and
                        transform
                        your life.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <img src="/images/about-us/bg-video-about-us.jpg" alt="Chris and Vital"
                                 className="w-full rounded-lg"/>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-6">Where it takes a village</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Chris and Vital live a world apart, but their shared passion for learning brought them
                                together to
                                create Project Magu — an internet-enabled school in Vital's remote village in Rwanda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-[#5624d0] py-16 px-4 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">Creating impact around the world</h2>
                    <p className="text-lg mb-12 px-24 opacity-90">
                        With our global catalog spanning the latest skills and topics, people and organizations
                        everywhere are able
                        to adapt to change and thrive.
                    </p>

                    <div className="grid grid-cols-4 gap-8 tracking-tighter">
                        <div>
                            <p className="text-[40px] leading-none font-bold">81M</p>
                            <div className="text-base opacity-90">Learners</div>
                        </div>
                        <div>
                            <p className="text-[40px] leading-none font-bold">85K</p>
                            <div className="text-base opacity-90">Instructors</div>
                        </div>
                        <div>
                            <p className="text-[40px] leading-none font-bold">250K+</p>
                            <div className="text-base opacity-90">Courses</div>
                        </div>
                        <div>
                            <p className="text-[40px] leading-none font-bold">1.1B</p>
                            <div className="text-base opacity-90">Course enrollments</div>
                        </div>

                        <div className="col-span-2">
                            <p className="text-[40px] leading-none font-bold">77</p>
                            <div className="text-base opacity-90">Languages</div>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[40px] leading-none font-bold">17K+</p>
                            <div className="text-base opacity-90">Enterprise customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Description Section */}
            <section className="pt-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-lg text-gray-700 leading-relaxed mb-8 font-semibold">
                        We help organizations of all types and sizes prepare for the path ahead — wherever it leads. Our
                        curated
                        collection of business and technical courses help companies, governments, and nonprofits go
                        further by
                        placing learning at the center of their strategies.
                    </p>
                    <a href="https://business.udemy.com/"
                       className="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-700 transition-colors cursor-pointer">
                        Learn more
                    </a>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <img src="/images/about-us/icon-quote.svg" alt="icon-quote" className="mb-2"/>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Udemy fit us like a glove. Their team curates fresh, up-to-date courses from their
                                marketplace and makes
                                them available to customers.
                            </p>
                            <div>
                                <p className="font-semibold text-gray-900">Varun Patil</p>
                                <p className="text-sm text-gray-600">Senior Manager of HR Development</p>
                                <a href="#"
                                   className="text-purple-600 text-sm hover:underline font-bold mt-3 inline-block">
                                    Read the Synechron case study →
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <img src="/images/about-us/icon-quote.svg" alt="icon-quote" className="mb-2"/>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                In total, it was a big success, I would get emails about what a fantastic resource it
                                was.
                            </p>
                            <div>
                                <p className="font-semibold text-gray-900">Alfred Helmerich</p>
                                <p className="text-sm text-gray-600">Executive Training Manager</p>
                                <a href="#"
                                   className="text-purple-600 text-sm hover:underline font-bold mt-3 inline-block">
                                    Read the NTT DATA case study →
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <img src="/images/about-us/icon-quote.svg" alt="icon-quote" className="mb-2"/>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Udemy responds to the needs of the business in an agile and global manner. It's truly
                                the best solution
                                for our employees and their careers.
                            </p>
                            <div>
                                <p className="font-semibold text-gray-900">Luz Santillana Romero</p>
                                <p className="text-sm text-gray-600">Development and Engagement Director</p>
                                <a href="#"
                                   className="text-purple-600 text-sm hover:underline font-bold mt-3 inline-block">
                                    Read the Indra case study →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Logos Section */}
            <section className="py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
                        <div className="flex justify-center">
                            <img src="/images/about-us/eventbrite-logo-grey.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/Citigroup_logo_gray.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/vimeo-logo-gray.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/Tata_logo.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/Aflac_logo1.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60 mt-8">
                        <div className="flex justify-center">
                            <img src="/images/about-us/SurveyMonkey-logo-grey.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/Kaiser-logo-grey.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/Nordea.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                        <div className="flex justify-center">
                            <img src="/images/about-us/VW-logo-grey.png" alt=""
                                 className="max-h-12 w-auto object-contain"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Three-Column Section */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div>
                            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-red-500 mb-6"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Work with us</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                At Udemy, we're all learners and instructors. We live out our values every day to create
                                a culture that
                                is diverse, inclusive, and committed to helping employees thrive.
                            </p>
                            <a href="#" className="text-purple-600 font-medium hover:underline">
                                Join our team →
                            </a>
                        </div>

                        <div>
                            <div className="w-full h-2 bg-gradient-to-r from-red-500 to-blue-500 mb-6"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">See our research</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                We're committed to improving lives through learning. Dig into our original research to
                                learn about the
                                forces that are shaping the modern workplace.
                            </p>
                            <a href="#" className="text-purple-600 font-medium hover:underline">
                                Learn more →
                            </a>
                        </div>

                        <div>
                            <div className="w-full h-2 bg-gradient-to-r from-green-500 to-green-700 mb-6"></div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Read our blog</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Want to know what we've been up to lately? Check out the Udemy blog to get the scoop on
                                the latest news,
                                ideas and projects, and more.
                            </p>
                            <a href="#" className="text-teal-500 font-medium hover:underline">
                                Read now →
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
