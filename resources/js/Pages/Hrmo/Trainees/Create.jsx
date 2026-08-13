import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    AcademicCapIcon,
    CalendarIcon,
    ClockIcon,
    BuildingOffice2Icon,
    UserGroupIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    IdentificationIcon,
    MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        school: '',
        course: '',
        year_level: '',
        start_date: '',
        expected_end_date: '',
        required_hours: 500,
        department_id: '',
        supervisor: '',
        status: 'active',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('hrmo.trainees.store'));
    }

    // Helper to get error state class
    const errorClass = (field) => errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500';

    // Common input classes
    const inputBase = 'block w-full rounded-lg border shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none';
    const inputWithIcon = 'pl-10';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Trainee</h2>}>
            <Head title="Add Trainee" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Human‑centered header */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <UserGroupIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add New Trainee</h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Enter the trainee's details below. All fields are required unless marked optional.
                                </p>
                                <Link
                                    href={route('hrmo.trainees.index')}
                                    className="inline-flex items-center gap-2 mt-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <ArrowLeftIcon className="w-4 h-4" />
                                    Back to Trainees
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl">
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
                            {/* Personal Information */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <UserCircleIcon className="w-5 h-5 text-indigo-600" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={e => setData('first_name', e.target.value)}
                                                placeholder="e.g. Juan"
                                                className={`${inputBase} ${errorClass('first_name')}`}
                                            />
                                        </div>
                                        {errors.first_name && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.first_name}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.middle_name}
                                                onChange={e => setData('middle_name', e.target.value)}
                                                placeholder="e.g. Santos"
                                                className={`${inputBase} ${errorClass('middle_name')}`}
                                            />
                                        </div>
                                        {errors.middle_name && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.middle_name}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={e => setData('last_name', e.target.value)}
                                                placeholder="e.g. Dela Cruz"
                                                className={`${inputBase} ${errorClass('last_name')}`}
                                            />
                                        </div>
                                        {errors.last_name && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.last_name}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="trainee@email.com"
                                                className={`${inputBase} ${inputWithIcon} ${errorClass('email')}`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={data.contact_number}
                                                onChange={e => setData('contact_number', e.target.value)}
                                                placeholder="+63 912 345 6789"
                                                className={`${inputBase} ${inputWithIcon} ${errorClass('contact_number')}`}
                                            />
                                        </div>
                                        {errors.contact_number && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.contact_number}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Education */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                                    Education
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">School <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.school}
                                                onChange={e => setData('school', e.target.value)}
                                                placeholder="e.g. University of the Philippines"
                                                className={`${inputBase} ${errorClass('school')}`}
                                            />
                                        </div>
                                        {errors.school && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.school}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.course}
                                                onChange={e => setData('course', e.target.value)}
                                                placeholder="e.g. BS Computer Science"
                                                className={`${inputBase} ${errorClass('course')}`}
                                            />
                                        </div>
                                        {errors.course && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.course}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Level <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.year_level}
                                                onChange={e => setData('year_level', e.target.value)}
                                                placeholder="e.g. 4th Year"
                                                className={`${inputBase} ${errorClass('year_level')}`}
                                            />
                                        </div>
                                        {errors.year_level && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.year_level}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* OJT Details */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                                    OJT Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={e => setData('start_date', e.target.value)}
                                                className={`${inputBase} ${inputWithIcon} ${errorClass('start_date')}`}
                                            />
                                        </div>
                                        {errors.start_date && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.start_date}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected End Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={data.expected_end_date}
                                                onChange={e => setData('expected_end_date', e.target.value)}
                                                className={`${inputBase} ${inputWithIcon} ${errorClass('expected_end_date')}`}
                                            />
                                        </div>
                                        {errors.expected_end_date && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.expected_end_date}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Hours <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={data.required_hours}
                                                onChange={e => setData('required_hours', parseInt(e.target.value))}
                                                min="1"
                                                className={`${inputBase} ${inputWithIcon} ${errorClass('required_hours')}`}
                                            />
                                        </div>
                                        {errors.required_hours && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.required_hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <select
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className={`${inputBase} ${errorClass('status')} appearance-none pr-10`}
                                            >
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="on_hold">On Hold</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.status && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Assignment */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <BuildingOffice2Icon className="w-5 h-5 text-indigo-600" />
                                    Assignment
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                value={data.department_id}
                                                onChange={e => setData('department_id', e.target.value)}
                                                className={`${inputBase} ${errorClass('department_id')} appearance-none pr-10`}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name} ({dept.code})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                                                    <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.department_id && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.department_id}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={data.supervisor}
                                                onChange={e => setData('supervisor', e.target.value)}
                                                placeholder="e.g. Dr. Maria Reyes"
                                                className={`${inputBase} ${errorClass('supervisor')}`}
                                            />
                                        </div>
                                        {errors.supervisor && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.supervisor}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Submit */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500">
                                    <span className="text-red-500">*</span> Required fields
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('hrmo.trainees.index')}
                                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-200"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Create Trainee
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
