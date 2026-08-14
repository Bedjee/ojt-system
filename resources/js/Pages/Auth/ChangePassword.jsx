import { Head, useForm } from '@inertiajs/react';
import {
    LockClosedIcon,
    KeyIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ChangePassword() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { data, setData, post, processing, errors } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('password.update'));
    }

    // Dynamic classes based on theme
    const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBgClass = isDark ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white';
    const cardBorderClass = isDark ? 'border-gray-700' : 'border-gray-100';
    const textPrimaryClass = isDark ? 'text-white' : 'text-gray-900';
    const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
    const inputBgClass = isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200';
    const inputFocusClass = isDark ? 'focus:ring-indigo-500' : 'focus:ring-blue-500';
    const labelClass = isDark ? 'text-gray-300' : 'text-gray-700';
    const iconClass = isDark ? 'text-gray-500' : 'text-gray-400';
    const buttonClass = isDark
        ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

    return (
        <>
            <Head title="Change Password - OJT Management" />
            <div className={`min-h-screen ${bgClass} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className={`absolute -top-40 -right-40 w-96 h-96 ${isDark ? 'bg-indigo-600/10' : 'bg-blue-100/30'} rounded-full blur-3xl`}></div>
                    <div className={`absolute -bottom-40 -left-40 w-96 h-96 ${isDark ? 'bg-blue-600/10' : 'bg-indigo-100/20'} rounded-full blur-3xl`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${isDark ? 'bg-indigo-500/5' : 'bg-blue-50/20'} rounded-full blur-3xl`}></div>
                </div>

                <div className="relative max-w-md w-full space-y-8">
                    {/* Logo / Branding */}
                    <div className="text-center">
                        <div className="flex justify-center">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
                                OJT
                            </div>
                        </div>
                        <h2 className={`mt-4 text-3xl font-extrabold ${textPrimaryClass} tracking-tight`}>
                            Change Password
                        </h2>
                        <p className={`mt-2 text-sm ${textSecondaryClass}`}>
                            You are required to change your default password before continuing.
                        </p>
                    </div>

                    {/* Change Password Form */}
                    <form onSubmit={handleSubmit} className={`mt-8 space-y-6 ${cardBgClass} p-6 sm:p-8 rounded-2xl shadow-lg border ${cardBorderClass} transition-colors duration-200`}>
                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="current_password" className={`block text-sm font-medium ${labelClass}`}>
                                    Current Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className={`h-5 w-5 ${iconClass}`} />
                                    </div>
                                    <input
                                        id="current_password"
                                        type="password"
                                        name="current_password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        autoComplete="current-password"
                                        autoFocus
                                        className={`pl-10 block w-full rounded-lg ${inputBgClass} shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 ${inputFocusClass} focus:border-transparent`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.current_password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="new_password" className={`block text-sm font-medium ${labelClass}`}>
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon className={`h-5 w-5 ${iconClass}`} />
                                    </div>
                                    <input
                                        id="new_password"
                                        type="password"
                                        name="new_password"
                                        value={data.new_password}
                                        onChange={(e) => setData('new_password', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg ${inputBgClass} shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 ${inputFocusClass} focus:border-transparent`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.new_password && (
                                    <p className="mt-1 text-sm text-red-500">{errors.new_password}</p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="new_password_confirmation" className={`block text-sm font-medium ${labelClass}`}>
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CheckCircleIcon className={`h-5 w-5 ${iconClass}`} />
                                    </div>
                                    <input
                                        id="new_password_confirmation"
                                        type="password"
                                        name="new_password_confirmation"
                                        value={data.new_password_confirmation}
                                        onChange={(e) => setData('new_password_confirmation', e.target.value)}
                                        className={`pl-10 block w-full rounded-lg ${inputBgClass} shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 ${inputFocusClass} focus:border-transparent`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
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

                    {/* Version info */}
                    <p className={`text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        OJT Management System v1.0
                    </p>
                </div>
            </div>
        </>
    );
}
