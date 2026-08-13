import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';

export default function AdminLayout({ header, children }) {
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);
    const user = usePage().props.auth.user;

    // Admin-specific sidebar items
    const adminMenu = [
        { name: 'Dashboard', route: 'admin.dashboard', icon: '🏠' },
        // more later
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {/* Sidebar – visible on md+ */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 hidden md:block">
                    <div className="mb-6">
                        <ApplicationLogo className="h-10 w-auto" />
                    </div>
                    <nav>
                        {adminMenu.map((item) => (
                            <NavLink
                                key={item.route}
                                href={route(item.route)}
                                active={route().current(item.route)}
                                className="flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-100"
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <div className="flex-1">
                    {/* Top navigation bar */}
                    <nav className="bg-white border-b border-gray-100">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                {/* Mobile logo */}
                                <div className="flex items-center md:hidden">
                                    <Link href="/">
                                        <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                                    </Link>
                                </div>

                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    {/* User dropdown */}
                                    <div className="ml-3 relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition">
                                                    {user.name}
                                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Mobile hamburger */}
                                <div className="-mr-2 flex items-center sm:hidden">
                                    <button
                                        onClick={() => setShowingMobileMenu(!showingMobileMenu)}
                                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                                    >
                                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path className={!showingMobileMenu ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                            <path className={showingMobileMenu ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu dropdown */}
                        <div className={(showingMobileMenu ? 'block' : 'hidden') + ' sm:hidden'}>
                            <div className="pt-2 pb-3 space-y-1">
                                {adminMenu.map((item) => (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        {item.icon} {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="pt-4 pb-1 border-t border-gray-200">
                                <div className="px-4">
                                    <div className="font-medium text-gray-800">{user.name}</div>
                                    <div className="font-medium text-sm text-gray-500">{user.email}</div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <Link href={route('profile.edit')} className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Page Header (optional) */}
                    {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
