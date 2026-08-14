import { useForm } from '@inertiajs/react';
import { useTheme } from '@/Contexts/ThemeContext';
import {
    LockClosedIcon,
    KeyIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function UpdatePasswordForm({ className = '' }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('password.update'), {
            onFinish: () => {
                // Optionally reset fields after success
                if (recentlySuccessful) {
                    setData({
                        current_password: '',
                        new_password: '',
                        new_password_confirmation: '',
                    });
                }
            },
        });
    }

    // Input base classes with dark mode support
    const inputBase =
        'block w-full rounded-lg border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent';
    const inputWithIcon = 'pl-10';
    const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
    const iconClass = 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500';

    return (
        <div className={className}>
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
                <LockClosedIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                Change Password
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                    <label htmlFor="current_password" className={labelClass}>Current Password</label>
                    <div className="relative">
                        <LockClosedIcon className={iconClass} />
                        <input
                            id="current_password"
                            type="password"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            className={`${inputBase} ${inputWithIcon}`}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>
                    {errors.current_password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.current_password}</p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label htmlFor="new_password" className={labelClass}>New Password</label>
                    <div className="relative">
                        <KeyIcon className={iconClass} />
                        <input
                            id="new_password"
                            type="password"
                            value={data.new_password}
                            onChange={(e) => setData('new_password', e.target.value)}
                            className={`${inputBase} ${inputWithIcon}`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                    </div>
                    {errors.new_password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.new_password}</p>
                    )}
                </div>

                {/* Confirm New Password */}
                <div>
                    <label htmlFor="new_password_confirmation" className={labelClass}>Confirm New Password</label>
                    <div className="relative">
                        <CheckCircleIcon className={iconClass} />
                        <input
                            id="new_password_confirmation"
                            type="password"
                            value={data.new_password_confirmation}
                            onChange={(e) => setData('new_password_confirmation', e.target.value)}
                            className={`${inputBase} ${inputWithIcon}`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                        />
                    </div>
                </div>

                {/* Submit & Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
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
                            'Update Password'
                        )}
                    </button>
                    {recentlySuccessful && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4" /> Password updated!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
