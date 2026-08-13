import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    BuildingOffice2Icon,
    PlusIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function Index({ departments, filters }) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, get } = useForm({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    function handleFilterSubmit(e) {
        e.preventDefault();
        get(route('hrmo.departments.index'), data);
    }

    function resetFilters() {
        setData({
            search: '',
            status: '',
        });
        get(route('hrmo.departments.index'), {
            search: '',
            status: '',
        });
    }

    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('hrmo.departments.destroy', id));
        }
    }

    // Helper for status badge
    const statusBadge = (isActive) => {
        if (isActive) {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-red-100 text-red-800';
    };

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Departments</h2>}>
            <Head title="Departments" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Human‑centered header */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div className="flex items-start gap-3">
                                <BuildingOffice2Icon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Manage Departments</h3>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        View, search, and manage all departments in the organization.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route('hrmo.departments.create')}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Department
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Search</label>
                                            <div className="mt-1 relative">
                                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.search}
                                                    onChange={e => setData('search', e.target.value)}
                                                    placeholder="Name or code..."
                                                    className="pl-9 w-full border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-2.5 px-4 transition duration-150 ease-in-out"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className="mt-1 w-full border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-2.5 px-4 transition duration-150 ease-in-out appearance-none"
                                            >
                                                <option value="">All Statuses</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
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
                            )}
                        </div>
                    </div>

                    {/* Departments Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl">
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {departments.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                                No departments found matching the filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        departments.data.map((dept) => (
                                            <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">{dept.name}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{dept.code}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-500">{dept.description || '—'}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${statusBadge(dept.is_active)}`}>
                                                        {dept.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route('hrmo.departments.edit', dept.id)}
                                                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(dept.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {departments.links && departments.links.length > 3 && (
                            <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="text-xs sm:text-sm text-gray-500">
                                        Showing {departments.from} to {departments.to} of {departments.total} entries
                                    </div>
                                    <div className="flex gap-1">
                                        {departments.links.map((link, index) => (
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
