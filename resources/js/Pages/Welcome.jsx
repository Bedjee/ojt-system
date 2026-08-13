import { Head, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    UserGroupIcon,
    QrCodeIcon,
    ChartBarIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const features = [
        {
            icon: CalendarIcon,
            title: 'Attendance Tracking',
            description: 'Log your daily attendance with a simple QR scan or manual entry. Track time-in, lunch breaks, and time-out effortlessly.',
        },
        {
            icon: ChartBarIcon,
            title: 'Progress Monitoring',
            description: 'View your completed hours, remaining hours, and overall OJT progress at a glance. Stay on top of your requirements.',
        },
        {
            icon: QrCodeIcon,
            title: 'QR Code Scanning',
            description: 'Trainees can scan the official OJT QR code using their mobile phones to record attendance instantly and accurately.',
        },
        {
            icon: UserGroupIcon,
            title: 'HRMO Management',
            description: 'Administrators can manage trainees, departments, attendance records, and settings from a centralized dashboard.',
        },
    ];

    return (
        <>
            <Head title="Welcome - OJT Management" />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    OJT
                                </div>
                                <span className="text-lg font-bold text-gray-800">OJT MS</span>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
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
                <main>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                                <span className="block">OJT Management</span>
                                <span className="block text-blue-600">Made Simple</span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                                Track attendance, monitor progress, and complete your OJT requirements with ease. Built for trainees, HRMO, and supervisors.
                            </p>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                        >
                                            Start Your OJT
                                        </Link>

                                    </>
                                )}
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600 mx-auto">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-gray-900 text-center">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 text-center">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Section */}
                        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white">
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                Ready to streamline your OJT experience?
                            </h2>
                            <p className="mt-4 text-blue-100 max-w-lg mx-auto">
                                Join hundreds of trainees and HRMO staff who manage their OJT seamlessly.
                            </p>
                            {!auth.user && (
                                <div className="mt-8">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        Get Started Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200/50 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                            <div>
                                &copy; {new Date().getFullYear()} OJT Management System. All rights reserved.
                            </div>
                            <div>
                               Developed by SyntraHR
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
