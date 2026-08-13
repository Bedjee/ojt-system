import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    AdjustmentsHorizontalIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    ClockIcon,
    UserCircleIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function AttendanceList({ trainee, records, filters, statuses }) {
    const { data, setData, get } = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        status: filters.status || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        get(route('hrmo.trainees.attendance-records.index', trainee.id), data);
    }

    function resetFilters() {
        setData({
            date_from: '',
            date_to: '',
            status: '',
        });
        get(route('hrmo.trainees.attendance-records.index', trainee.id), {
            date_from: '',
            date_to: '',
            status: '',
        });
    }

    function handleExport() {
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            if (data[key]) params.append(key, data[key]);
        });
        window.location.href = route('hrmo.trainees.attendance.export', trainee.id) + '?' + params.toString();
    }

    const statusBadge = (status) => {
        const classes = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-gray-100 text-gray-800',
            incomplete: 'bg-yellow-100 text-yellow-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const inputBase = 'block w-full rounded-lg border-gray-200 shadow-sm py-1.5 px-3 text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attendance Records – {trainee.full_name}</h2>}>
            <Head title="Attendance Records" />
            <div className="py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-full mx-auto">
                    {/* Compact Trainee Summary Card */}
                    <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <UserCircleIcon className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-700">{trainee.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">{trainee.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">
                                Rendered: <span className="font-medium text-green-600">{trainee.rendered_hours}</span> /
                                Required: <span className="font-medium">{trainee.required_hours}</span> /
                                Remaining: <span className="font-medium text-yellow-600">{trainee.remaining_hours}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-gray-500">Progress:</span>
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                <div
                                    className="bg-indigo-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(trainee.progress, 100)}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium">{trainee.progress}%</span>
                        </div>
                    </div>

                    {/* Filters – compact version */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-4">
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
                                    <h4 className="text-sm font-medium text-gray-700">Filters</h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleExport}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium shadow-sm"
                                >
                                    <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                    Export CSV
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-0.5">Date From</label>
                                        <input
                                            type="date"
                                            value={data.date_from}
                                            onChange={e => setData('date_from', e.target.value)}
                                            className={inputBase}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-0.5">Date To</label>
                                        <input
                                            type="date"
                                            value={data.date_to}
                                            onChange={e => setData('date_to', e.target.value)}
                                            className={inputBase}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-0.5">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className={`${inputBase} appearance-none pr-8`}
                                        >
                                            <option value="">All Statuses</option>
                                            {statuses.map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Compact Dense Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-1.5 text-left font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Morning In</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Lunch Out</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Afternoon In</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Time Out</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">AM Hrs</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">PM Hrs</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-2 py-1.5 text-center font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {records.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-6 text-center text-gray-500 text-sm">
                                                No attendance records found for this trainee.
                                            </td>
                                        </tr>
                                    ) : (
                                        records.data.map((record) => (
                                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-2 py-1.5 font-medium text-gray-800 whitespace-nowrap">{record.date}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.morning_time_in || '—'}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.lunch_time_out || '—'}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.afternoon_time_in || '—'}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.time_out || '—'}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.morning_hours}</td>
                                                <td className="px-2 py-1.5 text-center text-gray-700">{record.afternoon_hours}</td>
                                                <td className="px-2 py-1.5 text-center font-semibold text-gray-800">{record.total_hours}</td>
                                                <td className="px-2 py-1.5 text-center">
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-1.5 text-center">
                                                    {record.is_manual ? (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Manual
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                                            </svg>
                                                            QR
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination – compact */}
                        {records.links && records.links.length > 3 && (
                            <div className="px-3 py-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs text-gray-500">
                                    Showing {records.from} to {records.to} of {records.total} entries
                                </div>
                                <div className="flex gap-1">
                                    {records.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-2 py-1 rounded-md text-xs transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                    ? 'text-gray-700 hover:bg-gray-100'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={(e) => {
                                                if (!link.url) e.preventDefault();
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
