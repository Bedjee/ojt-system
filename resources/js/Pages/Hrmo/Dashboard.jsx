import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    CheckCircleIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    ClockIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    FireIcon,
} from '@heroicons/react/24/outline';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

// Color palette for charts
const COLORS = ['#4db85b', '#ffc30d', '#eb4e27', '#EF4444', '#8B5CF6', '#EC4899'];

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

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleFilterSubmit(e) {
        e.preventDefault();
        get(route('hrmo.dashboard'), data);
    }

    function resetFilters() {
        setData({
            search: '',
            department: '',
            status: '',
            date: new Date().toISOString().split('T')[0],
        });
        get(route('hrmo.dashboard'), {
            search: '',
            department: '',
            status: '',
            date: new Date().toISOString().split('T')[0],
        });
    }

    // Stats cards data
    const statCards = [
        { label: 'Active Trainees', value: stats.totalActive, icon: UserGroupIcon },
        { label: 'Completed Trainees', value: stats.totalCompleted, icon: CheckCircleIcon },
        { label: 'Currently Present', value: stats.currentlyPresent, icon: UserIcon },
        { label: 'Currently Out', value: stats.currentlyOut, icon: ArrowRightOnRectangleIcon },
        { label: 'Total Hours Rendered', value: stats.totalHoursRendered + ' hrs', icon: ClockIcon },
        { label: 'Near Completion (≥80%)', value: stats.nearCompletion, icon: FireIcon },
        { label: 'Attendance Issues', value: stats.attendanceIssues, icon: ExclamationTriangleIcon },
    ];

    // Helper for status badges
    const statusBadge = (status) => {
        const classes = {
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            on_hold: 'bg-yellow-100 text-yellow-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const todayStatusBadge = (status) => {
        const classes = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-gray-100 text-gray-800',
            incomplete: 'bg-yellow-100 text-yellow-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const inputBase = 'block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

    // Near completion list for spotlight
    const nearCompletionTrainees = trainees.filter(t => t.progress >= 80 && t.progress < 100);

    // Prepare data for attendance summary pie chart
    const attendancePieData = [
        { name: 'Present', value: attendanceSummary.present },
        { name: 'Incomplete', value: attendanceSummary.incomplete },
        { name: 'Absent', value: attendanceSummary.absent },
    ];

    // Overall progress donut data
    const overallDonutData = [
        { name: 'Rendered', value: overallProgress.rendered },
        { name: 'Remaining', value: overallProgress.required - overallProgress.rendered },
    ];

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">HRMO Dashboard</h2>}>
            <Head title="HRMO Dashboard" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div
                        className={`mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6 transition-all duration-700 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <UserGroupIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">HRMO Overview</h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Monitor trainee progress, attendance, and performance at a glance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            const delay = index * 75;
                            return (
                                <div
                                    key={index}
                                    className={`bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                                        mounted
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ transitionDelay: `${delay}ms` }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-xs sm:text-sm text-indigo-100 font-medium">{stat.label}</div>
                                            <div className="text-xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                        </div>
                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-200 opacity-80" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ======================== */}
                    {/* CHARTS SECTION            */}
                    {/* ======================== */}

                    {/* Row 1: Overall Progress + Attendance Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Overall OJT Progress</h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={overallDonutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#4F46E5" />
                                            <Cell fill="#1a1b1b" />
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} hrs`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center text-sm text-gray-600 mt-1">
                                {overallProgress.completion}% completed ({overallProgress.rendered} / {overallProgress.required} hrs)
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Attendance Status</h4>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={attendancePieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {attendancePieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Department Progress */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Department Progress</h4>
                        {departmentProgress.length === 0 ? (
                            <p className="text-gray-500 text-sm">No departments with data.</p>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={departmentProgress}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `${value} hrs`} />
                                        <Legend />
                                        <Bar dataKey="rendered" fill="#4F46E5" name="Rendered" />
                                        <Bar dataKey="required" fill="#131313" name="Required" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Row 3: Top 3 vs Lowest 5 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Top 3 Trainees (by rendered hours)</h4>
                            {topTrainees.length === 0 ? (
                                <p className="text-gray-500 text-sm">No data.</p>
                            ) : (
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topTrainees}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `${value} hrs`} />
                                            <Bar dataKey="rendered" fill="#10B981" name="Rendered" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">Lowest 5 Trainees (by rendered hours)</h4>
                            {lowestTrainees.length === 0 ? (
                                <p className="text-gray-500 text-sm">No data.</p>
                            ) : (
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={lowestTrainees}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => `${value} hrs`} />
                                            <Bar dataKey="rendered" fill="#EF4444" name="Rendered" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Daily Attendance Trends */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Daily Attendance Trends (last 30 days)</h4>
                        {trendData.length === 0 ? (
                            <p className="text-gray-500 text-sm">No data.</p>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="total_hours" stroke="#4F46E5" name="Total Hours" />
                                        <Line yAxisId="right" type="monotone" dataKey="records" stroke="#10B981" name="Records" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Row 5: Near Completion & Incomplete Records */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Near Completion (≥80%)</h4>
                            {nearCompletionList.length === 0 ? (
                                <p className="text-gray-500 text-sm">No trainees in this range.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                    {nearCompletionList.map((t, i) => (
                                        <li key={i} className="py-2 flex justify-between text-sm">
                                            <span>{t.name}</span>
                                            <span className="text-indigo-600 font-semibold">{t.progress}%</span>
                                            <span className="text-gray-500">{t.department}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Incomplete Attendance (last 7 days)</h4>
                            {incompleteRecords.length === 0 ? (
                                <p className="text-gray-500 text-sm">No incomplete records.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                    {incompleteRecords.map((rec, i) => (
                                        <li key={i} className="py-2 flex justify-between text-sm">
                                            <span>{rec.trainee}</span>
                                            <span className="text-gray-500">{rec.date}</span>
                                            <span className="text-yellow-600">{rec.missing}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* ======================== */}
                    {/* END CHARTS SECTION          */}
                    {/* ======================== */}

                    {/* Near Completion Spotlight (optional, but we already have it above) */}
                    {nearCompletionTrainees.length > 0 && (
                        <div
                            className={`mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-200 p-4 sm:p-6 transition-all duration-700 ${
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <FireIcon className="w-6 h-6 text-indigo-600" />
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                                    Trainees Close to Completion ({nearCompletionTrainees.length})
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {nearCompletionTrainees.slice(0, 5).map((t) => (
                                    <div
                                        key={t.id}
                                        className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-indigo-100 flex items-center gap-2 text-sm"
                                    >
                                        <span className="font-medium text-gray-800">{t.name}</span>
                                        <span className="text-indigo-600 font-semibold">{t.progress}%</span>
                                        <span className="text-xs text-gray-500">{t.department}</span>
                                    </div>
                                ))}
                                {nearCompletionTrainees.length > 5 && (
                                    <div className="bg-white/80 rounded-lg px-4 py-2 shadow-sm border border-indigo-100 text-sm text-gray-500">
                                        +{nearCompletionTrainees.length - 5} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div
                        className={`bg-white overflow-hidden shadow-sm rounded-xl mb-6 transition-all duration-500 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                    >
                        <div className="p-4 sm:p-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                            >
                                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                            {showFilters && (
                                <form onSubmit={handleFilterSubmit} className="mt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Search Trainee</label>
                                            <div className="mt-1 relative">
                                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.search}
                                                    onChange={e => setData('search', e.target.value)}
                                                    placeholder="Name or email..."
                                                    className={inputBase}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                value={data.department}
                                                onChange={e => setData('department', e.target.value)}
                                                className={`${inputBase} appearance-none pr-10`}
                                            >
                                                <option value="">All Departments</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className={`${inputBase} appearance-none pr-10`}
                                            >
                                                <option value="">All Statuses</option>
                                                {statuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={e => setData('date', e.target.value)}
                                                className={inputBase}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                        >
                                            Apply Filters
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Monitoring Table */}
                    <div
                        className={`bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-700 ${
                            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    >
                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-gray-100">
                            {trainees.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No trainees found.</div>
                            ) : (
                                trainees.map((trainee, idx) => {
                                    const progress = trainee.progress;
                                    const isNearCompletion = progress >= 80 && progress < 100;
                                    return (
                                        <div
                                            key={trainee.id}
                                            className={`p-4 transition-all duration-300 ${
                                                mounted ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            style={{ transitionDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{trainee.name}</div>
                                                    <div className="text-sm text-gray-500">{trainee.department}</div>
                                                </div>
                                                {isNearCompletion && (
                                                    <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                                        <FireIcon className="w-3 h-3" /> Near Completion
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 text-sm mt-2">
                                                <div className="text-gray-500">Today</div>
                                                <div className="text-gray-800 text-right">{trainee.today_hours} hrs</div>
                                                <div className="text-gray-500">Total</div>
                                                <div className="text-gray-800 text-right">{trainee.total_hours} hrs</div>
                                                <div className="text-gray-500">Remaining</div>
                                                <div className="text-gray-800 text-right">{trainee.remaining_hours} hrs</div>
                                                <div className="text-gray-500">Progress</div>
                                                <div className="text-gray-800 text-right font-semibold">
                                                    {trainee.progress}%
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                        <div
                                                            className={`h-1.5 rounded-full ${
                                                                progress >= 80 ? 'bg-green-500' :
                                                                progress >= 50 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="text-gray-500">Status</div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusBadge(trainee.status)}`}>
                                                        {trainee.status}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500">Today's Status</div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${todayStatusBadge(trainee.today_status)}`}>
                                                        {trainee.today_status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Table View */}
                        <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Trainee</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Today</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Today's Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Near Completion</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trainees.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                No trainees found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        trainees.map((trainee, idx) => {
                                            const progress = trainee.progress;
                                            const isNearCompletion = progress >= 80 && progress < 100;
                                            return (
                                                <tr
                                                    key={trainee.id}
                                                    className={`hover:bg-gray-50 transition-colors ${
                                                        mounted ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                    style={{ transition: 'opacity 0.3s ease-in-out', transitionDelay: `${idx * 50}ms` }}
                                                >
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">{trainee.name}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.department}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{trainee.today_hours} hrs</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{trainee.total_hours} hrs</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{trainee.remaining_hours} hrs</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${
                                                                        progress >= 80 ? 'bg-green-500' :
                                                                        progress >= 50 ? 'bg-yellow-500' :
                                                                        'bg-red-500'
                                                                    }`}
                                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs sm:text-sm">{progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${statusBadge(trainee.status)}`}>
                                                            {trainee.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${todayStatusBadge(trainee.today_status)}`}>
                                                            {trainee.today_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                        {isNearCompletion && (
                                                            <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-medium">
                                                                <FireIcon className="w-3 h-3" /> Yes
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
