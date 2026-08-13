import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    CalendarIcon,
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
    EyeIcon,
} from '@heroicons/react/24/outline';

export default function Index({ trainees, filters, departments, statuses }) {
    // Provide fallback in case trainees is undefined
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
            active: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            on_hold: 'bg-yellow-100 text-yellow-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    const inputBase = 'block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attendance Records</h2>}>
            <Head title="Attendance Records" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Trainee Attendance Records</h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    View each trainee's attendance summary. Click "View Attendance" for detailed history.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl mb-6">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400" />
                                <h4 className="text-sm font-medium text-gray-700">Filters</h4>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.search}
                                                onChange={e => setData('search', e.target.value)}
                                                placeholder="Name or email..."
                                                className={`${inputBase} pl-9`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            value={data.department_id}
                                            onChange={e => setData('department_id', e.target.value)}
                                            className={`${inputBase} appearance-none pr-10`}
                                        >
                                            <option value="">All Departments</option>
                                            {departments?.map((dept) => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className={`${inputBase} appearance-none pr-10`}
                                        >
                                            <option value="">All Statuses</option>
                                            {statuses?.map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
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
                        </div>
                    </div>

                    {/* Trainees Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl">
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Trainee</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Required</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Rendered</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {traineesData.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                                No trainees found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        traineesData.data.map((trainee) => (
                                            <tr key={trainee.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">{trainee.name}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.email}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.department}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">{trainee.required_hours}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-green-600 font-medium">{trainee.rendered_hours}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-yellow-600">{trainee.remaining_hours}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                                            <div
                                                                className="bg-indigo-600 h-1.5 sm:h-2 rounded-full"
                                                                style={{ width: `${Math.min(trainee.progress, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs">{trainee.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${statusBadge(trainee.status)}`}>
                                                        {trainee.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <Link
    href={route('hrmo.trainees.attendance-records.index', trainee.id)}
    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
>
    <EyeIcon className="w-4 h-4" />
    View Attendance
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
                            <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        Showing {traineesData.from} to {traineesData.to} of {traineesData.total} entries
                                    </div>
                                    <div className="flex gap-1">
                                        {traineesData.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
