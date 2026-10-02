import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    FireIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    CalendarDaysIcon,
    ChevronRightIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BoltIcon,
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

// ---------- Palette ----------
const BRAND = '#0d9488';        // teal-600
const BRAND_SOFT = '#ccfbf1';   // teal-100
const STATUS = {
    present:    { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', chip: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800' },
    incomplete: { dot: 'bg-amber-500',   text: 'text-amber-700 dark:text-amber-400',     chip: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800' },
    absent:     { dot: 'bg-slate-400',   text: 'text-slate-600 dark:text-slate-400',     chip: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-700' },
};
const TRAINEE_STATUS = {
    active:    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-emerald-200 dark:ring-emerald-800',
    completed: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 ring-sky-200 dark:ring-sky-800',
    cancelled: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 ring-rose-200 dark:ring-rose-800',
    on_hold:   'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-amber-200 dark:ring-amber-800',
};

const ACCENTS = {
    teal:    { bg: 'bg-teal-50 dark:bg-teal-900/20',    iconBg: 'bg-teal-600',    text: 'text-teal-700 dark:text-teal-400',       ring: 'ring-teal-100 dark:ring-teal-900/40' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconBg: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-900/40' },
    sky:     { bg: 'bg-sky-50 dark:bg-sky-900/20',      iconBg: 'bg-sky-600',     text: 'text-sky-700 dark:text-sky-400',         ring: 'ring-sky-100 dark:ring-sky-900/40' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-900/20',    iconBg: 'bg-rose-600',    text: 'text-rose-700 dark:text-rose-400',       ring: 'ring-rose-100 dark:ring-rose-900/40' },
    slate:   { bg: 'bg-slate-100 dark:bg-slate-800',    iconBg: 'bg-slate-500',   text: 'text-slate-700 dark:text-slate-300',     ring: 'ring-slate-100 dark:ring-slate-800' },
};

const n = (v) => Math.round(Number(v) || 0);

export default function Dashboard({
    stats,
    trainees,
    departments,
    statuses,
    filters,
    departmentProgress,
    topTrainees,
    lowestTrainees,
    overallProgress,
    nearCompletionList,
    attendanceSummary,
    incompleteRecords,
    trendData,
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { data, setData, get } = useForm({
        search: filters.search || '',
        department: filters.department || '',
        status: filters.status || '',
        date: filters.date || new Date().toISOString().split('T')[0],
    });

    useEffect(() => setMounted(true), []);

    function handleFilterSubmit(e) {
        e.preventDefault();
        get(route('hrmo.dashboard'), data);
    }

    function resetFilters() {
        const today = new Date().toISOString().split('T')[0];
        setData({ search: '', department: '', status: '', date: today });
        get(route('hrmo.dashboard'), { search: '', department: '', status: '', date: today });
    }

    // ---------- Derived ----------
    const completionRate = n(overallProgress.completion);
    const totalTrainees = stats.totalActive + stats.totalCompleted;
    const totalToday = attendanceSummary.present + attendanceSummary.incomplete + attendanceSummary.absent;
    const presentPct = totalToday > 0 ? (attendanceSummary.present / totalToday) * 100 : 0;
    const incompletePct = totalToday > 0 ? (attendanceSummary.incomplete / totalToday) * 100 : 0;
    const absentPct = totalToday > 0 ? (attendanceSummary.absent / totalToday) * 100 : 0;

    // Attention items — combine incomplete records + near-completion nudges
    const attentionItems = [
        ...incompleteRecords.slice(0, 4).map((r) => ({
            type: 'incomplete',
            title: r.trainee,
            meta: `${r.date} · ${r.missing}`,
        })),
        ...nearCompletionList.slice(0, 3).map((t) => ({
            type: 'near',
            title: t.name,
            meta: `${t.progress}% · ${t.department}`,
        })),
    ].slice(0, 6);

    // KPI cards — 4 meaningful cards with clear hierarchy
    const kpis = [
        {
            label: 'Active Trainees',
            value: stats.totalActive,
            sub: `${totalTrainees} total · ${stats.totalCompleted} completed`,
            icon: UserGroupIcon,
            accent: 'teal',
        },
        {
            label: 'Overall Completion',
            value: `${completionRate}%`,
            sub: `${n(overallProgress.rendered)} / ${n(overallProgress.required)} hrs`,
            icon: ClockIcon,
            accent: 'emerald',
        },
        {
            label: 'Present Today',
            value: stats.currentlyPresent,
            sub: `${stats.currentlyOut} out · ${attendanceSummary.absent} absent`,
            icon: CheckCircleIcon,
            accent: 'sky',
        },
        {
            label: 'Issues Today',
            value: stats.attendanceIssues,
            sub: stats.attendanceIssues > 0 ? 'Requires attention' : 'All clear',
            icon: ExclamationTriangleIcon,
            accent: stats.attendanceIssues > 0 ? 'rose' : 'slate',
        },
    ];

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-slate-800 dark:text-slate-200 leading-tight">HRMO Dashboard</h2>}>
            <Head title="HRMO Dashboard" />

            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* ================= HEADER ================= */}
                    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Monitoring {totalTrainees} trainees · {new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters((s) => !s)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors self-start sm:self-auto"
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            {showFilters ? 'Hide filters' : 'Show filters'}
                        </button>
                    </div>

                    {/* ================= FILTERS ================= */}
                    {showFilters && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5">
                            <form onSubmit={handleFilterSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Search</label>
                                        <MagnifyingGlassIcon className="absolute left-3 top-[34px] w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            placeholder="Name or email..."
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Department</label>
                                        <select
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">All departments</option>
                                            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">All statuses</option>
                                            {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="w-full rounded-lg border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                                        Apply
                                    </button>
                                    <button type="button" onClick={resetFilters} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= KPI ROW ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.map((kpi, i) => {
                            const Icon = kpi.icon;
                            const a = ACCENTS[kpi.accent];
                            return (
                                <div
                                    key={i}
                                    className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 transition-all duration-500 hover:shadow-md ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                                    style={{ transitionDelay: `${i * 60}ms` }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{kpi.label}</p>
                                            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">{kpi.value}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{kpi.sub}</p>
                                        </div>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${a.iconBg} flex items-center justify-center shadow-sm`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ================= TODAY'S PULSE + NEEDS ATTENTION ================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Today's Attendance Pulse — 2 cols */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Today's Attendance</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{totalToday} records for {data.date}</p>
                                </div>
                                <CalendarDaysIcon className="w-5 h-5 text-slate-400" />
                            </div>

                            {/* Proportional bar */}
                            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700 mb-5">
                                <div className="bg-emerald-500" style={{ width: `${presentPct}%` }} title={`Present: ${attendanceSummary.present}`} />
                                <div className="bg-amber-500" style={{ width: `${incompletePct}%` }} title={`Incomplete: ${attendanceSummary.incomplete}`} />
                                <div className="bg-slate-400" style={{ width: `${absentPct}%` }} title={`Absent: ${attendanceSummary.absent}`} />
                            </div>

                            {/* Legend with counts */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: 'present',    label: 'Present',    value: attendanceSummary.present },
                                    { key: 'incomplete', label: 'Incomplete', value: attendanceSummary.incomplete },
                                    { key: 'absent',     label: 'Absent',     value: attendanceSummary.absent },
                                ].map((row) => (
                                    <div key={row.key} className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${STATUS[row.key].dot}`} />
                                        <div className="min-w-0">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{row.label}</p>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">{row.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Secondary mini stats */}
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    <div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Currently In</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stats.currentlyPresent}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                    <div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Already Out</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stats.currentlyOut}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Hours Today</p>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {n(trainees.reduce((s, t) => s + Number(t.today_hours || 0), 0))} hrs
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Needs Attention — 1 col */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Needs Attention</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Incomplete & near-completion</p>
                                </div>
                                <BoltIcon className={`w-5 h-5 ${attentionItems.length > 0 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                            </div>

                            {attentionItems.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                                    <CheckCircleIcon className="w-10 h-10 text-emerald-400 mb-2" />
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">All clear</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No pending issues right now</p>
                                </div>
                            ) : (
                                <ul className="flex-1 space-y-2 overflow-y-auto max-h-64 -mr-2 pr-2">
                                    {attentionItems.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type === 'near' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.meta}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* ================= DEPARTMENT PROGRESS ================= */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Department Progress</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Rendered vs required hours per department</p>
                            </div>
                        </div>
                        {departmentProgress.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No department data available.</p>
                        ) : (
                            <div className="space-y-4">
                                {[...departmentProgress]
                                    .sort((a, b) => b.completion - a.completion)
                                    .map((d, i) => {
                                        const pct = Math.min(n(d.completion), 100);
                                        return (
                                            <div key={i} className="space-y-1.5">
                                                <div className="flex items-baseline justify-between gap-3">
                                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{d.name}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">{n(d.rendered)}</span> / {n(d.required)} hrs · <span className="font-semibold text-teal-700 dark:text-teal-400">{pct}%</span>
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-700"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* ================= PERFORMANCE — TOP + BOTTOM ================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Top performers */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Top Performers</h3>
                            </div>
                            {topTrainees.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No data.</p>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {topTrainees.map((t, i) => (
                                        <li key={i} className="py-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate uppercase">{t.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.department}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                                {n(t.rendered)} hrs
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Needs improvement */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ArrowTrendingDownIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Needs Improvement</h3>
                            </div>
                            {lowestTrainees.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400">No data.</p>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {lowestTrainees.map((t, i) => (
                                        <li key={i} className="py-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate uppercase">{t.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{t.department}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                                {n(t.rendered)} hrs
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* ================= TREND ================= */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Attendance Trend</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total hours rendered per day · last 30 days</p>
                            </div>
                        </div>
                        {trendData.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400 py-10 text-center">No trend data available.</p>
                        ) : (
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                                                <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: '#64748b' }}
                                            tickFormatter={(v) => v.slice(5)}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 8,
                                                border: '1px solid #e2e8f0',
                                                fontSize: 12,
                                            }}
                                            formatter={(value) => [`${n(value)} hrs`, 'Total hours']}
                                            labelFormatter={(l) => new Date(l).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        />
                                        <Area type="monotone" dataKey="total_hours" stroke={BRAND} strokeWidth={2} fill="url(#trendFill)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* ================= TRAINEE MONITORING TABLE ================= */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Trainee Monitoring</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live status for {data.date}</p>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{trainees.length} shown</span>
                        </div>

                        {trainees.length === 0 ? (
                            <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">No trainees match the current filters.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trainee</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today</th>
                                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Remaining</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                                            <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today</th>
                                            <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {trainees.map((t) => {
                                            const pct = Math.min(n(t.progress), 100);
                                            const isNear = pct >= 80 && pct < 100;
                                            return (
                                                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-slate-800 dark:text-slate-200 uppercase">{t.name}</span>
                                                            {isNear && <FireIcon className="w-3.5 h-3.5 text-teal-500" title="Near completion" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.department}</td>
                                                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{n(t.today_hours)} hrs</td>
                                                    <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">{n(t.total_hours)} hrs</td>
                                                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{n(t.remaining_hours)} hrs</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2 min-w-[110px]">
                                                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-teal-500' : 'bg-amber-500'}`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 w-9 text-right">{pct}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ${STATUS[t.today_status]?.chip || STATUS.absent.chip}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS[t.today_status]?.dot || STATUS.absent.dot}`} />
                                                            {t.today_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ${TRAINEE_STATUS[t.status] || TRAINEE_STATUS.on_hold}`}>
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}