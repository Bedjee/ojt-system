import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    Bars3Icon,
    BuildingOffice2Icon,
    CheckCircleIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Features', href: '#features' },
];

const FEATURES = [
    {
        icon: AcademicCapIcon,
        title: 'OJT Students',
        description: 'Track progress and submit requirements.',
        accent: 'bg-blue-50 text-blue-600',
    },
    {
        icon: UserGroupIcon,
        title: 'Mentors',
        description: 'Monitor performance and give feedback.',
        accent: 'bg-sky-50 text-sky-600',
    },
    {
        icon: BuildingOffice2Icon,
        title: 'Coordinators',
        description: 'Manage programs and reports with ease.',
        accent: 'bg-indigo-50 text-indigo-600',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Secure & Reliable',
        description: 'Your data stays safe and trusted.',
        accent: 'bg-cyan-50 text-cyan-700',
    },
];

const PRIMARY_BUTTON =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98]';

/* ------------------------------------------------------------------ */
/*  Graduation Cap illustration                                        */
/* ------------------------------------------------------------------ */

function GraduationCapIllustration() {
    return (
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            {/* Soft blue glow behind the cap */}
            <div
                className="absolute -inset-6 rounded-full bg-gradient-to-br from-blue-100/70 via-sky-50/50 to-transparent blur-3xl"
                aria-hidden="true"
            />

            <svg
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Graduation cap symbolizing OJT completion"
                className="relative w-full drop-shadow-[0_20px_35px_rgba(30,58,138,0.15)]"
            >
                <defs>
                    <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="capSide" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                    <linearGradient id="capBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="100%" stopColor="#172554" />
                    </linearGradient>
                    <linearGradient id="tasselGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <radialGradient id="bgRing" cx="50%" cy="50%" r="50%">
                        <stop offset="60%" stopColor="#EFF6FF" stopOpacity="0" />
                        <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.7" />
                    </radialGradient>
                </defs>

                {/* Decorative background ring */}
                <circle cx="200" cy="200" r="170" fill="url(#bgRing)" />

                {/* Floating accent dots */}
                <circle cx="70" cy="120" r="6" fill="#93C5FD" />
                <circle cx="330" cy="100" r="5" fill="#BFDBFE" />
                <circle cx="345" cy="300" r="7" fill="#93C5FD" />
                <circle cx="60" cy="290" r="4" fill="#BFDBFE" />
                <circle cx="200" cy="55" r="4" fill="#93C5FD" opacity="0.7" />

                {/* Small sparkle accents */}
                <path
                    d="M100 80 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z"
                    fill="#60A5FA"
                    opacity="0.7"
                />
                <path
                    d="M310 250 l2.5 6 l6 2.5 l-6 2.5 l-2.5 6 l-2.5 -6 l-6 -2.5 l6 -2.5 z"
                    fill="#93C5FD"
                    opacity="0.8"
                />

                {/* ── Graduation Cap ── */}

                {/* Base / band (cylinder under the mortarboard) */}
                <path
                    d="M120 210 Q120 250 200 250 Q280 250 280 210 L280 235 Q280 275 200 275 Q120 275 120 235 Z"
                    fill="url(#capBase)"
                />

                {/* Base ellipse rim */}
                <ellipse cx="200" cy="235" rx="80" ry="22" fill="#1E40AF" />
                <ellipse cx="200" cy="233" rx="80" ry="22" fill="#1E3A8A" />

                {/* Mortarboard top (diamond) */}
                <path
                    d="M200 130 L340 200 L200 270 L60 200 Z"
                    fill="url(#capTop)"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Highlight edge on the top-left face */}
                <path
                    d="M200 130 L340 200 L200 270 L60 200 Z"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="1.5"
                    opacity="0.6"
                    strokeLinejoin="round"
                />

                {/* Center button */}
                <circle cx="200" cy="200" r="6" fill="#1E3A8A" />
                <circle cx="200" cy="199" r="4" fill="#1E40AF" />

                {/* Tassel cord */}
                <path
                    d="M200 195 Q215 180 260 190 Q290 200 300 230"
                    stroke="url(#tasselGold)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Tassel strands */}
                <path
                    d="M300 230 Q305 250 300 275"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M303 232 Q310 252 306 277"
                    stroke="#FBBF24"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M297 232 Q300 252 294 276"
                    stroke="#FCD34D"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Tassel knot */}
                <circle cx="300" cy="230" r="5" fill="#F59E0B" />
                <circle cx="299" cy="229" r="3" fill="#FCD34D" />

                {/* Subtle shadow beneath the cap */}
                <ellipse cx="200" cy="285" rx="95" ry="8" fill="#1E3A8A" opacity="0.1" />
            </svg>

            {/* Floating progress badge */}
            <div className="absolute bottom-2 right-0 hidden rounded-xl bg-white px-3.5 py-2.5 shadow-lg ring-1 ring-slate-900/5 sm:block">
                <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <CheckCircleIcon className="h-4 w-4" />
                    </span>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-900">
                            Progress tracked
                        </p>
                        <p className="text-[10px] text-slate-500">70% completed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function Welcome({ auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAuthenticated = Boolean(auth?.user);
    const ctaHref = isAuthenticated ? route('dashboard') : route('login');
    const ctaLabel = isAuthenticated ? 'Go to Dashboard' : 'Get Started';
    const headerLabel = isAuthenticated ? 'Dashboard' : 'Login';

    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const root = document.documentElement;
        const previous = root.style.scrollBehavior;
        root.style.scrollBehavior = 'smooth';
        return () => {
            root.style.scrollBehavior = previous;
        };
    }, []);

    return (
        <>
            <Head title="Welcome — OJT Management System" />

            {/* One-viewport layout on desktop, natural scroll on mobile */}
            <div className="flex min-h-screen flex-col bg-white lg:h-screen lg:min-h-0 lg:overflow-hidden">
                {/* ============================= HEADER ============================= */}
                <header className="flex-none border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <a href="#home" className="flex items-center gap-2.5" onClick={closeMenu}>
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
                                <AcademicCapIcon className="h-5 w-5" />
                            </span>
                            <span className="text-base font-bold tracking-tight text-slate-900">
                                OJT System
                            </span>
                        </a>

                        <nav className="hidden items-center gap-8 md:flex">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden md:block">
                            <Link href={ctaHref} className={PRIMARY_BUTTON}>
                                {headerLabel}
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((v) => !v)}
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="border-t border-slate-100 bg-white md:hidden">
                            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="mt-3 mb-1 border-t border-slate-100 pt-4">
                                    <Link
                                        href={ctaHref}
                                        onClick={closeMenu}
                                        className={`${PRIMARY_BUTTON} w-full py-3`}
                                    >
                                        {headerLabel}
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </header>

                {/* ============================= MAIN ============================= */}
                <main className="flex flex-1 flex-col lg:min-h-0">
                    {/* ── Hero ── */}
                    <section
                        id="home"
                        className="relative flex flex-1 items-center overflow-hidden"
                    >
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
                            <div className="absolute bottom-[-8rem] left-[-6rem] h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
                        </div>

                        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-8">
                            {/* Left: copy */}
                            <div className="text-center lg:text-left">
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
                                    Welcome to
                                </p>

                                <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                    OJT Management{' '}
                                    <span className="text-blue-600">System</span>
                                </h1>

                                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0">
                                    A simple and efficient platform to manage On-the-Job Training
                                    for students, mentors, and coordinators.
                                </p>

                                <div className="mt-6 flex justify-center lg:justify-start">
                                    <Link
                                        href={ctaHref}
                                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                                    >
                                        {ctaLabel}
                                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <p className="mt-5 text-sm text-slate-500">
                                    No spreadsheets. No missed hours. Just progress.
                                </p>
                            </div>

                            {/* Right: graduation cap illustration */}
                            <GraduationCapIllustration />
                        </div>
                    </section>

                    {/* ── Features (compact strip) ── */}
                    <section
                        id="features"
                        className="flex-none border-t border-slate-100 bg-slate-50/60"
                    >
                        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:gap-4 lg:px-8 lg:py-5">
                            {FEATURES.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={f.title}
                                        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md lg:p-4"
                                    >
                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.accent}`}
                                        >
                                            <Icon className="h-4.5 w-4.5" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {f.title}
                                            </h3>
                                            <p className="mt-0.5 text-xs leading-snug text-slate-500">
                                                {f.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </main>

                {/* ============================= FOOTER ============================= */}
                <footer className="flex-none bg-slate-900">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <AcademicCapIcon className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-semibold text-white">
                                OJT Management System
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Empowering Students, Supporting Growth · © {new Date().getFullYear()}
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}