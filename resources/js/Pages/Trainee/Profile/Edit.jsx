import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import {
    UserCircleIcon,
    AcademicCapIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Edit({ trainee }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        first_name: trainee.first_name,
        middle_name: trainee.middle_name || '',
        last_name: trainee.last_name,
        email: trainee.user.email,
        contact_number: trainee.contact_number || '',
        school: trainee.school,
        course: trainee.course,
        year_level: trainee.year_level,
    });

    function handleSubmit(e) {
        e.preventDefault();
        patch(route('trainee.profile.update'));
    }

    // Animation classes
    const fadeUp = `transition-all duration-500 ease-out transform ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    }`;

    // Input base classes (with dark mode support)
    const inputBase =
        'block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent';
    const inputWithIcon = 'pl-10';

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Profile</h2>}>
            <Head title="My Profile" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Human‑centered header – dark mode ready */}
                    <div className={`${fadeUp} mb-6`}>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800/50 p-4 sm:p-6 transition-colors duration-200">
                            <div className="flex items-start gap-3">
                                <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Your Profile</h3>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        View and update your personal and academic information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Profile form */}
                        <div className={`${fadeUp} transition-delay-100`}>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl transition-colors duration-200">
                                <div className="p-4 sm:p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Personal Information */}
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                                                <UserCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                Personal Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.first_name}
                                                        onChange={e => setData('first_name', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. Juan"
                                                    />
                                                    {errors.first_name && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.first_name}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.middle_name}
                                                        onChange={e => setData('middle_name', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. Santos"
                                                    />
                                                    {errors.middle_name && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.middle_name}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.last_name}
                                                        onChange={e => setData('last_name', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. Dela Cruz"
                                                    />
                                                    {errors.last_name && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.last_name}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                                    <div className="relative">
                                                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        <input
                                                            type="email"
                                                            value={data.email}
                                                            onChange={e => setData('email', e.target.value)}
                                                            className={`${inputBase} ${inputWithIcon}`}
                                                            placeholder="you@example.com"
                                                        />
                                                    </div>
                                                    {errors.email && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.email}</div>
                                                    )}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                                                    <div className="relative">
                                                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        <input
                                                            type="text"
                                                            value={data.contact_number}
                                                            onChange={e => setData('contact_number', e.target.value)}
                                                            className={`${inputBase} ${inputWithIcon}`}
                                                            placeholder="e.g. 09123456789"
                                                        />
                                                    </div>
                                                    {errors.contact_number && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.contact_number}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Information */}
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                                                <AcademicCapIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                                Academic Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School</label>
                                                    <input
                                                        type="text"
                                                        value={data.school}
                                                        onChange={e => setData('school', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. University of the Philippines"
                                                    />
                                                    {errors.school && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.school}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                                                    <input
                                                        type="text"
                                                        value={data.course}
                                                        onChange={e => setData('course', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. BS Computer Science"
                                                    />
                                                    {errors.course && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.course}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
                                                    <input
                                                        type="text"
                                                        value={data.year_level}
                                                        onChange={e => setData('year_level', e.target.value)}
                                                        className={inputBase}
                                                        placeholder="e.g. 4th Year"
                                                    />
                                                    {errors.year_level && (
                                                        <div className="mt-1 text-red-600 dark:text-red-400 text-sm">{errors.year_level}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save button */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                                            >
                                                {processing ? (
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                )}
                                                {processing ? 'Saving...' : 'Save Profile'}
                                            </button>
                                            {recentlySuccessful && (
                                                <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                                    <CheckCircleIcon className="w-4 h-4" /> Saved!
                                                </span>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Password Change Section */}
                        <div className={`${fadeUp} transition-delay-200`}>
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl p-4 sm:p-6 transition-colors duration-200">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TraineeLayout>
    );
}
