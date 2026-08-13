import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm } from '@inertiajs/react';
import MapPicker from '@/Components/MapPicker';

export default function Edit({ department }) {
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        code: department.code,
        description: department.description || '',
        is_active: department.is_active,
        latitude: department.latitude || null,
        longitude: department.longitude || null,
        allowed_radius: department.allowed_radius || 100,
        geofencing_enabled: department.geofencing_enabled ?? true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('hrmo.departments.update', department.id));
    }

    const handleLocationChange = (lat, lng) => {
        setData('latitude', lat);
        setData('longitude', lng);
    };

    const handleRadiusChange = (radius) => {
        setData('allowed_radius', radius);
    };

    const inputBase = 'block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Department</h2>}>
            <Head title="Edit Department" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={inputBase}
                                    />
                                    {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                    <input
                                        type="text"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                        className={inputBase}
                                    />
                                    {errors.code && <div className="text-red-600 text-sm mt-1">{errors.code}</div>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="3"
                                        className={inputBase}
                                    />
                                    {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                                </div>
                                <div className="sm:col-span-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">Active</label>
                                </div>
                            </div>

                            {/* Geofencing Section */}
                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Geofencing Location
                                </h4>

                                <div className="mb-4">
                                    <MapPicker
                                        latitude={data.latitude}
                                        longitude={data.longitude}
                                        radius={data.allowed_radius || 100}
                                        onLocationChange={handleLocationChange}
                                        onRadiusChange={handleRadiusChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                        <input
                                            type="text"
                                            value={data.latitude || ''}
                                            readOnly
                                            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm py-2.5 px-4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                        <input
                                            type="text"
                                            value={data.longitude || ''}
                                            readOnly
                                            className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 shadow-sm py-2.5 px-4"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.geofencing_enabled}
                                        onChange={e => setData('geofencing_enabled', e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700">Enable Geofencing</label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Department'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </HrmoLayout>
    );
}
