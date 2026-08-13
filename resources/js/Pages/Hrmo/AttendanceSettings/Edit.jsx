import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Cog6ToothIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function Edit({ settings }) {
    const { data, setData, put, processing, errors } = useForm({
        morning_time_in_start: settings.morning_time_in_start || '07:00',
        morning_time_in_end: settings.morning_time_in_end || '11:59',
        lunch_time_out_start: settings.lunch_time_out_start || '12:00',
        lunch_time_out_end: settings.lunch_time_out_end || '12:30',
        afternoon_time_in_start: settings.afternoon_time_in_start || '12:31',
        afternoon_time_in_end: settings.afternoon_time_in_end || '16:59',
        time_out_start: settings.time_out_start || '17:00',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('hrmo.attendance-settings.update'));
    }

    // Common input class
    const inputBase = 'block w-full rounded-lg border-gray-200 shadow-sm py-2.5 px-4 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attendance Settings</h2>}>
            <Head title="Attendance Settings" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Human‑centered header */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-4 sm:p-6">
                        <div className="flex items-start gap-3">
                            <Cog6ToothIcon className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Attendance Time Settings</h3>
                                <p className="text-sm sm:text-base text-gray-700">
                                    Configure the allowed time windows for each attendance action. Trainees can only log entries within these ranges.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl">
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-8">
                            {/* Morning Time In */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                                    Morning Time In
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.morning_time_in_start}
                                            onChange={e => setData('morning_time_in_start', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.morning_time_in_start && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.morning_time_in_start}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.morning_time_in_end}
                                            onChange={e => setData('morning_time_in_end', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.morning_time_in_end && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.morning_time_in_end}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Lunch Time Out */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                                    Lunch Time Out
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.lunch_time_out_start}
                                            onChange={e => setData('lunch_time_out_start', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.lunch_time_out_start && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.lunch_time_out_start}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.lunch_time_out_end}
                                            onChange={e => setData('lunch_time_out_end', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.lunch_time_out_end && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.lunch_time_out_end}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Afternoon Time In */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                                    Afternoon Time In
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.afternoon_time_in_start}
                                            onChange={e => setData('afternoon_time_in_start', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.afternoon_time_in_start && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.afternoon_time_in_start}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.afternoon_time_in_end}
                                            onChange={e => setData('afternoon_time_in_end', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.afternoon_time_in_end && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.afternoon_time_in_end}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Time Out */}
                            <section>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                                    <ClockIcon className="w-5 h-5 text-indigo-600" />
                                    Time Out
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (from this time onward) <span className="text-red-500">*</span></label>
                                        <input
                                            type="time"
                                            value={data.time_out_start}
                                            onChange={e => setData('time_out_start', e.target.value)}
                                            className={inputBase}
                                        />
                                        {errors.time_out_start && (
                                            <div className="mt-1 text-red-600 text-sm flex items-center gap-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                {errors.time_out_start}
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
                                            Update Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </HrmoLayout>
    );
}
