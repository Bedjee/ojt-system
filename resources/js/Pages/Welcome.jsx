import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    CalendarIcon,
    UserGroupIcon,
    QrCodeIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: CalendarIcon,
            title: 'Effortless Hour Logging',
            description: 'Record your daily attendance with a single tap. No more manual spreadsheets or missed time entries.',
            color: 'indigo',
        },
        {
            icon: ChartBarIcon,
            title: 'Visual Progress Tracking',
            description: 'See how far you’ve come. Track rendered hours, remaining hours, and your completion percentage in real time.',
            color: 'blue',
        },
        {
            icon: QrCodeIcon,
            title: 'Secure QR Scanning',
            description: 'Instantly log in and out using the official OJT QR code. Fast, accurate, and completely secure.',
            color: 'indigo',
        },
        {
            icon: UserGroupIcon,
            title: 'HRMO & Supervisor Portal',
            description: 'Stay connected with your supervisors. HRMO gets a clear overview of your entire batch’s progress.',
            color: 'blue',
        },
    ];

    return (
        <>
            <Head title="Welcome - OJT Management" />
            <div className="min-h-screen bg-black overflow-x-hidden">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20">
                                    OJT
                                </div>
                                <span className="text-xl font-extrabold text-white tracking-tight">OJT MS</span>
                            </div>
                            <nav className="flex items-center gap-3 sm:gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-105 active:scale-95"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-105 active:scale-95"

                                        >
                                            Log in
                                        </Link>

                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden bg-black">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div
                            className={`transform transition-all duration-1000 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-indigo-400 shadow-sm">
                                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                                Built for OJT Excellence
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                                <span className="block text-white">Your OJT Journey</span>
                                <span className="block bg-gradient-to-r from-indigo-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                                    Starts Here
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed">
                                Log your hours, monitor your progress, and complete your requirements—all in one place. Built for trainees, HRMO, and supervisors.
                            </p>

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="group inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
                                    >
                                        Go to Dashboard
                                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
                                        >
                                            Start Your OJT
                                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="py-16 sm:py-24 bg-gray-900/50 border-y border-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                Everything you need to succeed
                            </h2>
                            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                                Designed to simplify attendance tracking and progress monitoring for OJT trainees.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                const colorMap = {
                                    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                                    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                };
                                const cardColor = colorMap[feature.color] || colorMap.indigo;
                                const delay = index * 100;

                                return (
                                    <div
                                        key={index}
                                        className={`group bg-gray-800/30 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/50 transition-all duration-300 hover:-translate-y-1 transform ${
                                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                        }`}
                                        style={{ transitionDelay: `${delay}ms` }}
                                    >
                                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${cardColor} mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 sm:py-24 bg-black">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Ready to track your OJT progress?
                        </h2>
                        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                            Join thousands of trainees and HRMO staff who manage their OJT seamlessly with our platform.
                        </p>
                        {!auth.user && (
                            <div className="mt-8">
                                <Link
                                    href={route('login')}
                                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Get Started Now
                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black border-t border-gray-800/50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                            <div>
                                &copy; {new Date().getFullYear()} OJT Management System. All rights reserved.
                            </div>
                            <div className="flex items-center gap-6">
                                <span>Developed by SyntraHR</span>
                                <span className="w-px h-4 bg-gray-800"></span>
                                <span>v1.0.0</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
