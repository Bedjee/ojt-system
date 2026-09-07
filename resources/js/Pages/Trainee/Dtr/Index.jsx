import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head, useForm } from '@inertiajs/react';
import { formatHours } from '@/Helpers/formatTime';
import {
    CalendarIcon,
    ArrowDownTrayIcon,
    UserCircleIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function Index({ trainee, records, month, half, summary }) {
    const { data, setData, get } = useForm({
        month: month,
        half: half || 'first',
    });

    function handleMonthChange(e) {
        const newMonth = e.target.value;
        setData('month', newMonth);
        get(route('trainee.dtr.index'), { month: newMonth, half: data.half });
    }

    function setHalf(newHalf) {
        setData('half', newHalf);
        get(route('trainee.dtr.index'), { month: data.month, half: newHalf });
    }

    function handleDownload() {
        window.location.href = route('trainee.dtr.download') + '?month=' + data.month + '&half=' + data.half;
    }

    const statusBadge = (status) => {
        const classes = {
            present: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            absent: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My DTR</h2>}>
            <Head title="My DTR" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50 p-4 sm:p-6 transition-colors duration-200">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Daily Time Record</h3>
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    View your attendance records and download your DTR as PDF.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Trainee Info Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-3">
                                <UserCircleIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Trainee</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{trainee.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <BuildingOffice2Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{trainee.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">School</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{trainee.school}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Course</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">{trainee.course}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month Selector + Half Toggles + Download */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Month:</label>
                            <input
                                type="month"
                                value={data.month}
                                onChange={handleMonthChange}
                                className="w-full sm:w-auto border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <div className="flex rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
                                <button
                                    onClick={() => setHalf('first')}
                                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                        data.half === 'first'
                                            ? 'bg-blue-600 text-white dark:bg-blue-700'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    1–15
                                </button>
                                <button
                                    onClick={() => setHalf('second')}
                                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                        data.half === 'second'
                                            ? 'bg-blue-600 text-white dark:bg-blue-700'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    16–31
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Rendered</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400">{formatHours(summary.total_rendered)}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Required</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">{formatHours(summary.total_required)}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Remaining</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-yellow-600 dark:text-yellow-400">{formatHours(summary.remaining)}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Present</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-green-600 dark:text-green-400 flex items-center justify-center gap-0.5">
                                <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {summary.present}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Incomplete</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-0.5">
                                <ExclamationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {summary.incomplete}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2.5 sm:p-4 border border-gray-200 dark:border-gray-700 text-center transition-colors duration-200">
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Absent</p>
                            <p className="text-sm sm:text-lg lg:text-xl font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-0.5">
                                <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" /> {summary.absent}
                            </p>
                        </div>
                    </div>

                    {/* DTR Records – Mobile card view + Table view */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        {/* Mobile Card View */}
                        <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
                            {records.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">No attendance records for this month.</div>
                            ) : (
                                records.map((record) => (
                                    <div key={record.date} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{record.date}</span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                            <div className="text-gray-500 dark:text-gray-400">Morning In</div>
                                            <div className="text-gray-900 dark:text-gray-100 text-right">{record.morning_in || '—'}</div>
                                            <div className="text-gray-500 dark:text-gray-400">Lunch Out</div>
                                            <div className="text-gray-900 dark:text-gray-100 text-right">{record.lunch_out || '—'}</div>
                                            <div className="text-gray-500 dark:text-gray-400">Afternoon In</div>
                                            <div className="text-gray-900 dark:text-gray-100 text-right">{record.afternoon_in || '—'}</div>
                                            <div className="text-gray-500 dark:text-gray-400">Time Out</div>
                                            <div className="text-gray-900 dark:text-gray-100 text-right">{record.time_out || '—'}</div>
                                            <div className="text-gray-500 dark:text-gray-400 font-medium">Total</div>
                                            <div className="text-gray-900 dark:text-gray-100 text-right font-semibold">{formatHours(record.total_hours)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Table View (hidden on mobile) */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Morning In</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lunch Out</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Afternoon In</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Out</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {records.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No attendance records for this month.</td>
                                        </tr>
                                    ) : (
                                        records.map((record) => (
                                            <tr key={record.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{record.date}</td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 dark:text-gray-300">{record.morning_in || '—'}</td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 dark:text-gray-300">{record.lunch_out || '—'}</td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 dark:text-gray-300">{record.afternoon_in || '—'}</td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center text-gray-700 dark:text-gray-300">{record.time_out || '—'}</td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatHours(record.total_hours)}
                                                </td>
                                                <td className="px-3 py-2 sm:px-4 sm:py-3 text-center">
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </TraineeLayout>
    );
}
