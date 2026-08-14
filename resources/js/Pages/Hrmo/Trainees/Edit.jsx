import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Edit({ trainee, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: trainee.first_name,
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name,
        email: trainee.email,
        contact_number: trainee.contact_number || '',
        school: trainee.school,
        course: trainee.course,
        year_level: trainee.year_level,
        start_date: trainee.start_date,
        expected_end_date: trainee.expected_end_date || '',
        required_hours: trainee.required_hours,
        department_id: trainee.department_id || '',
        supervisor: trainee.supervisor || '',
        status: trainee.status,
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('hrmo.trainees.update', trainee.id));
    }

    const inputBase = 'mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Trainee</h2>}>
            <Head title="Edit Trainee" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.first_name && <div className="text-red-600 text-sm">{errors.first_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                        <input
                                            type="text"
                                            value={data.middle_name}
                                            onChange={e => setData('middle_name', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.middle_name && <div className="text-red-600 text-sm">{errors.middle_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.last_name && <div className="text-red-600 text-sm">{errors.last_name}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                        <input
                                            type="text"
                                            value={data.contact_number}
                                            onChange={e => setData('contact_number', e.target.value)}
                                            className={inputBase}
                                            placeholder="e.g. 09123456789"
                                        />
                                        {errors.contact_number && <div className="text-red-600 text-sm">{errors.contact_number}</div>}
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-md font-semibold text-gray-800 mb-4">Academic Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">School</label>
                                            <input
                                                type="text"
                                                value={data.school}
                                                onChange={e => setData('school', e.target.value)}
                                                className={inputBase}
                                            />
                                            {errors.school && <div className="text-red-600 text-sm">{errors.school}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Course</label>
                                            <input
                                                type="text"
                                                value={data.course}
                                                onChange={e => setData('course', e.target.value)}
                                                className={inputBase}
                                            />
                                            {errors.course && <div className="text-red-600 text-sm">{errors.course}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Year Level</label>
                                            <input
                                                type="text"
                                                value={data.year_level}
                                                onChange={e => setData('year_level', e.target.value)}
                                                className={inputBase}
                                            />
                                            {errors.year_level && <div className="text-red-600 text-sm">{errors.year_level}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* OJT Details */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-md font-semibold text-gray-800 mb-4">OJT Details</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={e => setData('start_date', e.target.value)}
                                                className={inputBase}
                                            />
                                            {errors.start_date && <div className="text-red-600 text-sm">{errors.start_date}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
                                            <input
                                                type="date"
                                                value={data.expected_end_date}
                                                onChange={e => setData('expected_end_date', e.target.value)}
                                                className={inputBase}
                                            />
                                            {errors.expected_end_date && <div className="text-red-600 text-sm">{errors.expected_end_date}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Required OJT Hours</label>
                                            <input
                                                type="number"
                                                value={data.required_hours}
                                                onChange={e => setData('required_hours', parseInt(e.target.value))}
                                                className={inputBase}
                                            />
                                            {errors.required_hours && <div className="text-red-600 text-sm">{errors.required_hours}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                value={data.department_id}
                                                onChange={e => setData('department_id', e.target.value)}
                                                className={inputBase}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                                                ))}
                                            </select>
                                            {errors.department_id && <div className="text-red-600 text-sm">{errors.department_id}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                                            <input
                                                type="text"
                                                value={data.supervisor}
                                                onChange={e => setData('supervisor', e.target.value)}
                                                className={inputBase}
                                                placeholder="e.g. Engr. Juan Dela Cruz"
                                            />
                                            {errors.supervisor && <div className="text-red-600 text-sm">{errors.supervisor}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className={inputBase}
                                            >
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="on_hold">On Hold</option>
                                            </select>
                                            {errors.status && <div className="text-red-600 text-sm">{errors.status}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                                    <a
                                        href={route('hrmo.trainees.index')}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm font-medium"
                                    >
                                        {processing ? 'Updating...' : 'Update Trainee'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
