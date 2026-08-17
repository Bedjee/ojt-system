import { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    HomeIcon,
    CameraIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    CalendarDaysIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/Contexts/ThemeContext';

export default function TraineeLayout({ header, children }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const sidebarRef = useRef(null);
    const user = usePage().props.auth.user;
    const { theme, toggleTheme } = useTheme();

    const traineeMenu = [
        { name: 'Dashboard', route: 'trainee.dashboard', icon: HomeIcon },
        { name: 'Scan Attendance', route: 'trainee.scan.index', icon: CameraIcon },
        { name: 'My Calendar', route: 'trainee.attendance.index', icon: CalendarDaysIcon },
        { name: 'My Profile', route: 'trainee.profile.edit', icon: UserIcon },
        { name: 'My DTR', route: 'trainee.dtr.index', icon: CalendarDaysIcon },
    ];

    const isActive = (routeName) => route().current(routeName);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Close sidebar on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setMobileSidebarOpen(false);
            }
        }
        if (mobileSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [mobileSidebarOpen]);

    // Close sidebar when route changes
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [usePage().url]);

    const handleLogout = () => {
        setIsLoggingOut(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setIsLoggingOut(false);
                setShowLogoutModal(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Fixed Sidebar – visible on md+ */}
            <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200/80 dark:border-gray-700/80 p-5 hidden md:flex md:flex-col shadow-lg z-30 overflow-hidden transition-colors duration-200">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            OJT
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Trainee</span>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="w-5 h-5" />
                        ) : (
                            <MoonIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
                <nav className="flex-1 space-y-1">
                    {traineeMenu.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 group ${
                                    active
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border-r-4 border-blue-600 dark:border-blue-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${
                                        active
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    }`}
                                />
                                <span className={`font-medium ${active ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                        Online
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">v1.0.0</p>
                </div>
            </aside>

            {/* Main content wrapper */}
            <div className="md:ml-64 flex flex-col min-h-screen">
                {/* Fixed Top Navigation Bar */}
                <nav className="fixed top-0 left-0 right-0 md:left-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 z-20 shadow-sm h-16 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex justify-between items-center h-full">
                            {/* Mobile logo & hamburger */}
                            <div className="flex items-center gap-3 md:hidden">
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                                    aria-label="Open sidebar"
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </button>
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                                        OJT
                                    </div>
                                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Trainee</span>
                                </Link>
                            </div>

                            {/* Desktop logo (hidden on mobile) */}
                            <div className="hidden md:flex md:items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                                        OJT
                                    </div>
                                    <span className="text-lg font-bold text-gray-800 dark:text-gray-100">Trainee</span>
                                </Link>
                            </div>

                            {/* Desktop right section: theme toggle + user dropdown */}
                            <div className="hidden sm:flex sm:items-center sm:ml-6 ml-auto space-x-2">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? (
                                        <SunIcon className="w-5 h-5" />
                                    ) : (
                                        <MoonIcon className="w-5 h-5" />
                                    )}
                                </button>

                                <div className="ml-3 relative">
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                            {getInitials(user.name)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                                            {user.name}
                                        </span>
                                        <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </button>
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-20 border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    setShowLogoutModal(true);
                                                }}
                                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile right: theme toggle (visible on small screens) */}
                            <div className="flex items-center sm:hidden gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? (
                                        <SunIcon className="w-5 h-5" />
                                    ) : (
                                        <MoonIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Mobile Sidebar – slides in from left */}
                <div
                    className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                        mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div
                        className={`absolute inset-0 bg-black/50 dark:bg-black/70 transition-opacity duration-300 ${
                            mobileSidebarOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                        onClick={() => setMobileSidebarOpen(false)}
                    />

                    <div
                        ref={sidebarRef}
                        className={`absolute left-0 top-0 h-full w-80 max-w-[80%] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                        <div className="flex flex-col h-full p-4">
                            {/* Close + toggle theme (mobile sidebar header) */}
                            <div className="flex justify-between items-center mb-2">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? (
                                        <SunIcon className="w-5 h-5" />
                                    ) : (
                                        <MoonIcon className="w-5 h-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className="p-2 rounded-lg text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Close sidebar"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Brand */}
                            <div className="mb-6">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                        OJT
                                    </div>
                                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Trainee</span>
                                </Link>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-1 overflow-y-auto">
                                {traineeMenu.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.route);
                                    return (
                                        <Link
                                            key={item.route}
                                            href={route(item.route)}
                                            className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 group ${
                                                active
                                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border-r-4 border-blue-600 dark:border-blue-400'
                                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                                            }`}
                                            onClick={() => setMobileSidebarOpen(false)}
                                        >
                                            <Icon
                                                className={`w-5 h-5 transition-colors ${
                                                    active
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                }`}
                                            />
                                            <span className={`font-medium ${active ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* User & actions */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                        {getInitials(user.name)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-gray-100">{user.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            setMobileSidebarOpen(false);
                                            setShowLogoutModal(true);
                                        }}
                                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-200">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                            <div className="text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                                    <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Confirm Logout
                                </h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                    Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
                                </p>
                            </div>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging out...
                                        </>
                                    ) : (
                                        'Logout'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main content with top padding */}
                <main className="flex-1 pt-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
