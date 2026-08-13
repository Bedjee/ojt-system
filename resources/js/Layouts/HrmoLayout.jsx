import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    BuildingOffice2Icon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    QrCodeIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

export default function HrmoLayout({ header, children }) {
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const user = usePage().props.auth.user;
    const flash = usePage().props.flash;

    const hrmoMenu = [
        { name: 'Dashboard', route: 'hrmo.dashboard', icon: HomeIcon },
        { name: 'Trainees', route: 'hrmo.trainees.index', icon: UsersIcon },
        { name: 'Departments', route: 'hrmo.departments.index', icon: BuildingOffice2Icon },
        { name: 'Attendance Records', route: 'hrmo.attendance-records.index', icon: ClipboardDocumentListIcon },
        { name: 'Attendance Settings', route: 'hrmo.attendance-settings.edit', icon: Cog6ToothIcon },
        { name: 'QR Code', route: 'hrmo.qr-code.show', icon: QrCodeIcon },
        // more later
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Sidebar – visible on md+ */}
            <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200/80 p-5 hidden md:flex md:flex-col shadow-lg z-30 overflow-hidden">
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            HR
                        </div>
                        <span className="text-xl font-bold text-gray-800 tracking-tight">HRMO</span>
                    </Link>
                </div>
                <nav className="flex-1 space-y-1">
                    {hrmoMenu.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all duration-200 group ${
                                    active
                                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border-r-4 border-indigo-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${
                                        active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                                />
                                <span className={`font-medium ${active ? 'text-indigo-700' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                        Online
                    </div>
                    <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
                </div>
            </aside>

            {/* Main content wrapper with left margin for sidebar */}
            <div className="md:ml-64 flex flex-col min-h-screen">
                {/* Fixed Top Navigation Bar */}
                <nav className="fixed top-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-b border-gray-200/80 z-20 shadow-sm h-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex justify-between items-center h-full">
                            {/* Mobile logo (left) */}
                            <div className="flex items-center md:hidden">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                                        HR
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">HRMO</span>
                                </Link>
                            </div>

                            {/* Desktop user dropdown (right) */}
                            <div className="hidden sm:flex sm:items-center sm:ml-6 ml-auto">
                                <div className="ml-3 relative">
                                    <button
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                            {getInitials(user.name)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.name}</span>
                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                    </button>
                                    {showUserDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-20 border border-gray-100 overflow-hidden">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <UserCircleIcon className="w-4 h-4 text-gray-400" />
                                                 My Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
                                                Log Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile hamburger (right) */}
                            <div className="-mr-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                                >
                                    {showingMobileMenu ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu dropdown – overlay below fixed nav */}
                    <div
                        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                            showingMobileMenu ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
                        }`}
                    >
                        <div className="bg-white px-4 py-2 space-y-1">
                            {hrmoMenu.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.route);
                                return (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                                            active
                                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setShowingMobileMenu(false)}
                                    >
                                        <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="bg-gray-50/50 px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                    {getInitials(user.name)}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 flex flex-col space-y-1">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowingMobileMenu(false)}
                                >
                                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                    Profile
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setShowingMobileMenu(false)}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400" />
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content with top padding for fixed nav */}
                <main className="flex-1 pt-16">


                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Flash messages */}
                        {flash?.success && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 shadow-sm">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
                                <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                        )}

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
