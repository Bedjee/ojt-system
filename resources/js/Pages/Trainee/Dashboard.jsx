import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    UserIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ArrowPathIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon,
    FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { formatHours } from '@/Helpers/formatTime';

export default function Dashboard({ trainee, todayAttendance, recentAttendances, progress }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const getProgressMessage = (percent) => {
        if (percent >= 100) return "You've completed all your OJT hours – congratulations!";
        if (percent >= 75) return "You're almost there! Keep pushing, you're doing great.";
        if (percent >= 50) return "You're making excellent progress – stay focused!";
        if (percent >= 25) return "Great start! Keep the momentum going.";
        return "Every hour counts. You've got this – one step at a time.";
    };

    const isTodayComplete = todayAttendance &&
        todayAttendance.morning_time_in &&
        todayAttendance.lunch_time_out &&
        todayAttendance.afternoon_time_in &&
        todayAttendance.time_out;

    if (!trainee) {
        return (
            <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}>
                <Head title="Dashboard" />
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                        <ExclamationCircleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <p className="text-gray-700 dark:text-gray-300">Your trainee profile is not set up. Please contact HRMO.</p>
                    </div>
                </div>
            </TraineeLayout>
        );
    }

    const greeting = getTimeGreeting();
    const progressMsg = getProgressMessage(progress.percent);

    const fadeUp = `transition-all duration-500 ease-out transform ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`;

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}>
            <Head title="Dashboard" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                {/* Welcome message (dark mode ready) */}
                <div className={`${fadeUp} mb-6 sm:mb-8`}>
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-4 sm:p-6 md:p-7 relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

                        <div className="relative space-y-3 sm:space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                            {greeting}, {trainee.first_name}!
                                        </h3>
                                        <FaceSmileIcon className="w-5 h-5 text-yellow-300" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-xs font-medium text-white/80">Progress</span>
                                    <span className="text-sm font-bold text-white">{progress.percent}%</span>
                                    <div className="w-12 sm:w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full" style={{ width: `${progress.percent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm sm:text-base text-white/95 leading-relaxed">
                                    {isTodayComplete ? (
                                        <>
                                            You’ve completed your attendance today –{' '}
                                            <span className="font-semibold text-yellow-200">great job!</span>
                                        </>
                                    ) : (
                                        <>
                                            Don’t forget to log your attendance today. Every hour counts!
                                        </>
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                                <div className="flex items-center gap-2 text-sm sm:text-base text-white/90">
                                    <span className="text-yellow-300">⭐</span>
                                    <span className="font-medium">{progressMsg}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>{progress.rendered} hrs logged</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

               {/* Two-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Progress Card */}
                    <div className={`${fadeUp} transition-delay-100`}>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 transition-colors duration-200">
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                OJT Progress
                            </h4>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 text-sm sm:text-base">
                                    <span className="text-gray-600 dark:text-gray-400">Required Hours</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatHours(progress.required)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 text-sm sm:text-base">
                                    <span className="text-gray-600 dark:text-gray-400">Rendered Hours</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">{formatHours(progress.rendered)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 text-sm sm:text-base">
                                    <span className="text-gray-600 dark:text-gray-400">Remaining Hours</span>
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">{formatHours(progress.remaining)}</span>
                                </div>
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3">
                                        <div
                                            className="bg-blue-600 dark:bg-blue-500 h-2.5 sm:h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${progress.percent}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-right">{progress.percent}% completed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Assignment */}
                    <div className={`${fadeUp} transition-delay-200`}>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 transition-colors duration-200">
                            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                Current Assignment
                            </h4>
                            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Department</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{trainee.department}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Supervisor</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{trainee.supervisor}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{trainee.start_date}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <span className="text-gray-600 dark:text-gray-400">Expected End</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{trainee.expected_end_date || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                                    <span
                                        className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-full ${
                                            trainee.status === 'active'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                : trainee.status === 'completed'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                        }`}
                                    >
                                        {trainee.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Attendance */}
                <div className={`${fadeUp} transition-delay-300 mt-4 sm:mt-6`}>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 transition-colors duration-200">
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                            Today's Attendance
                        </h4>
                        {todayAttendance ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {['morning_time_in', 'lunch_time_out', 'afternoon_time_in', 'time_out'].map((key) => (
                                    <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 text-center transition-colors duration-200">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {key === 'morning_time_in' ? 'Morning In' : key === 'lunch_time_out' ? 'Lunch Out' : key === 'afternoon_time_in' ? 'Afternoon In' : 'Time Out'}
                                        </p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{todayAttendance[key] || '—'}</p>
                                    </div>
                                ))}
                                <div className="col-span-1 sm:col-span-2 md:col-span-4 mt-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2 sm:p-3 text-center transition-colors duration-200">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Hours Today</p>
                                    <p className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-400">
                                        {todayAttendance.total_hours ? formatHours(todayAttendance.total_hours) : '—'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 flex items-center justify-center gap-2 text-sm sm:text-base">
                                <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                                No attendance recorded today.
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className={`${fadeUp} transition-delay-400 mt-4 sm:mt-6`}>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6 transition-colors duration-200">
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                            Recent Attendance
                        </h4>
                        {recentAttendances.length > 0 ? (
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Morning In</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lunch Out</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Afternoon In</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Out</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentAttendances.map((att) => (
                                            <tr key={att.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{att.date}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">{att.morning_time_in || '—'}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">{att.lunch_time_out || '—'}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">{att.afternoon_time_in || '—'}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-700 dark:text-gray-300">{att.time_out || '—'}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                                                    {att.total_hours ? formatHours(att.total_hours) : '—'}
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                                                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                                                        att.status === 'present'
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                                            : att.status === 'incomplete'
                                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                    }`}>
                                                        {att.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 flex items-center justify-center gap-2 text-sm sm:text-base">
                                <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                                No recent attendance records.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </TraineeLayout>
    );
}
