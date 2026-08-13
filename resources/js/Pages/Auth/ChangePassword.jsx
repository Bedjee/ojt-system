import { Head, useForm } from '@inertiajs/react';
import {
    LockClosedIcon,
    KeyIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function ChangePassword() {
    const { data, setData, post, processing, errors } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('password.update'));
    }

    return (
        <>
            <Head title="Change Password - OJT Management" />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo / Branding */}
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                OJT
                            </div>
                        </div>
                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                            Change Password
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            You are required to change your default password before continuing.
                        </p>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="current_password"
                                        type="password"
                                        name="current_password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                        autoFocus
                                        className="pl-10 block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.current_password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="new_password"
                                        type="password"
                                        name="new_password"
                                        value={data.new_password}
                                        onChange={(e) => setData('new_password', e.target.value)}
                                        className="pl-10 block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.new_password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="new_password_confirmation"
                                        type="password"
                                        name="new_password_confirmation"
                                        value={data.new_password_confirmation}
                                        onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                        className="pl-10 block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>

                    {/* Version info (optional) */}
                    <p className="mt-4 text-center text-xs text-gray-400">
                        OJT Management System v1.0
                    </p>
                </div>
            </div>
        </>
    );
}
