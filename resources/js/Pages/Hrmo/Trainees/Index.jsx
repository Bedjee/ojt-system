import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    UserPlusIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
    UserGroupIcon,
    CalendarIcon,
    KeyIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function Index({ trainees, departments, statuses, filters }) {
    const { flash } = usePage().props;

    // Keep filters open if any filter is active
    const hasActiveFilters = filters?.search || filters?.department || filters?.status;
    const [showFilters, setShowFilters] = useState(!!hasActiveFilters);

    const { data, setData, get, processing } = useForm({
        search: filters?.search || '',
        department: filters?.department || '',
        status: filters?.status || '',
    });

    // Sync form with URL filters when they change (e.g., via pagination)
    useEffect(() => {
        setData({
            search: filters?.search || '',
            department: filters?.department || '',
            status: filters?.status || '',
        });
        const hasFilters = filters?.search || filters?.department || filters?.status;
        setShowFilters(!!hasFilters);
    }, [filters]);

    function handleFilterSubmit(e) {
        e.preventDefault();
        get(route('hrmo.trainees.index'), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const hasFilters = data.search || data.department || data.status;
                setShowFilters(!!hasFilters);
            },
        });
    }

    function resetFilters() {
        const resetData = { search: '', department: '', status: '' };
        setData(resetData);
        get(route('hrmo.trainees.index'), resetData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setShowFilters(false),
        });
    }

    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this trainee?')) {
            router.delete(route('hrmo.trainees.destroy', id));
        }
    }

    function handleResetPassword(id) {
        if (confirm('Reset password for this trainee to default (password123)?')) {
            router.post(route('hrmo.trainees.reset-password', id));
        }
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

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Trainees</h2>}>
            <Head title="Trainees" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
                            <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {/* Human‑centered header */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex items-start gap-3">
                                <UserGroupIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Manage Trainees</h3>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        View, search, and manage all OJT trainees in one place.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('hrmo.trainees.create')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                            >
                                <UserPlusIcon className="w-4 h-4" />
                                Add Trainee
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl mb-6">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Search</label>
                                            <div className="mt-1 relative">
                                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.search}
                                                    onChange={e => setData('search', e.target.value)}
                                                    placeholder="Name or email..."
                                                    className="pl-9 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                value={data.department}
                                                onChange={e => setData('department', e.target.value)}
                                                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            >
                                                <option value="">All Statuses</option>
                                                {statuses.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            disabled={processing}
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

                    {/* Trainees Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl">
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">School</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {trainees.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                No trainees found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        trainees.data.map((trainee) => (
                                            <tr key={trainee.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">{trainee.full_name}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.email}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.school}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{trainee.department}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${statusBadge(trainee.status)}`}>
                                                        {trainee.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route('hrmo.trainees.attendance.index', trainee.id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                                            title="Manage Attendance"
                                                        >
                                                            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </Link>
                                                        <Link
                                                            href={route('hrmo.trainees.edit', trainee.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(trainee.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPassword(trainee.id)}
                                                            className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                                            title="Reset Password"
                                                        >
                                                            <KeyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination – with preserved query string */}
                        {trainees.links && trainees.links.length > 3 && (
                            <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        Showing {trainees.from} to {trainees.to} of {trainees.total} entries
                                    </div>
                                    <div className="flex gap-1">
                                        {trainees.links.map((link, index) => (
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
                                                preserveState
                                                preserveScroll
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
