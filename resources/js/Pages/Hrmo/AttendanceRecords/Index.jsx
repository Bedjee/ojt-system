import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

export default function Index({ trainees, filters, departments, statuses }) {
    const traineesData = trainees ?? { data: [], links: [] };

    const { data, setData, get } = useForm({
        search: filters?.search || '',
        department_id: filters?.department_id || '',
        status: filters?.status || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        get(route('hrmo.attendance-records.index'), data);
    }

    function resetFilters() {
        setData({
            search: '',
            department_id: '',
            status: '',
        });
        get(route('hrmo.attendance-records.index'), {
            search: '',
            department_id: '',
            status: '',
        });
    }

    const statusBadge = (status) => {
        const classes = {
            active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const inputBase =
        'block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm py-2 px-3 text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Attendance Records</h2>}>
            <Head title="Attendance Records" />
            <div className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                <div className="w-full">
                    {/* Compact Header */}
                    <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 p-3 sm:p-4 transition-colors duration-200">
                        <div className="flex items-start gap-2">
                            <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">Trainee Attendance Records</h3>
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    View each trainee's attendance summary. Click "View Attendance" for detailed history.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Filters */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl mb-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Filters</h4>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            <input
                                                type="text"
                                                value={data.search}
                                                onChange={e => setData('search', e.target.value)}
                                                placeholder="Name or email..."
                                                className={`${inputBase} pl-8`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                                        <select
                                            value={data.department_id}
                                            onChange={e => setData('department_id', e.target.value)}
                                            className={`${inputBase} appearance-none pr-8`}
                                        >
                                            <option value="">All Departments</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className={`${inputBase} appearance-none pr-8`}
                                        >
                                            <option value="">All Statuses</option>
                                            {statuses?.map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium shadow-sm"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Trainees Table - Compact */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trainee</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Required</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rendered</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {traineesData.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No trainees found matching the filters.</td>
                                        </tr>
                                    ) : (
                                        traineesData.data.map((trainee) => (
                                            <tr key={trainee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-900 dark:text-gray-100 uppercase">{trainee.name}</td>
                                                <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 dark:text-gray-400">{trainee.email}</td>
                                                <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 dark:text-gray-400">{trainee.department}</td>
                                               <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center text-gray-700 dark:text-gray-300">{trainee.required_hours} hrs</td>
<td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center text-green-600 dark:text-green-400 font-medium">{trainee.rendered_hours} hrs</td>
<td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center text-yellow-600 dark:text-yellow-400">{trainee.remaining_hours} hrs</td>
                                                <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                    <div className="flex items-center gap-1 justify-center">
                                                        <div className="w-12 sm:w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                                            <div
                                                                className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full"
                                                                style={{ width: `${Math.min(trainee.progress, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300">{trainee.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusBadge(trainee.status)}`}>
                                                        {trainee.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                                                    <Link
                                                        href={route('hrmo.trainees.attendance-records.index', trainee.id)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-[10px] font-medium"
                                                    >
                                                        <EyeIcon className="w-3 h-3" />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {traineesData.links && traineesData.links.length > 3 && (
                            <div className="px-4 py-2 sm:px-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Showing {traineesData.from} to {traineesData.to} of {traineesData.total} entries
                                    </div>
                                    <div className="flex gap-1">
                                        {traineesData.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white'
                                                        : link.url
                                                        ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                onClick={(e) => {
                                                    if (!link.url) e.preventDefault();
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
