import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Create({ fields }) {
    const [lookup, setLookup] = useState({ existing: {}, missing: [], already_requested: [] });
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        date: '',
        requested_fields: [],
        requested_times: {},
        reason: '',
    });

    async function fetchMissing(date) {
        if (!date) return;
        setLoading(true);
        try {
            const res = await fetch(route('trainee.attendance-requests.missing-fields') + '?date=' + date, {
                headers: { Accept: 'application/json' },
            });
            const json = await res.json();
            setLookup(json);
            // Auto-select fields that are missing and not already requested
            setData('requested_fields', json.missing);
        } catch {
            setLookup({ existing: {}, missing: [], already_requested: [] });
        } finally {
            setLoading(false);
        }
    }

    function toggleField(field) {
        const set = new Set(data.requested_fields);
        set.has(field) ? set.delete(field) : set.add(field);
        setData('requested_fields', [...set]);
    }

    function submit(e) {
        e.preventDefault();
        post(route('trainee.attendance-requests.store'));
    }

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">New Attendance Request</h2>}>
            <Head title="New Attendance Request" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href={route('trainee.attendance-requests.index')}
                        className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mb-4"
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Back to requests
                    </Link>

                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-5">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Date of Attendance
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    setData('date', e.target.value);
                                    fetchMissing(e.target.value);
                                }}
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                required
                            />
                            {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
                        </div>

                        {/* Existing vs Missing summary */}
                        {data.date && !loading && (
                            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/40 p-4 space-y-3">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Attendance Status for {data.date}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {Object.entries(fields).map(([key, label]) => {
                                        const existing = lookup.existing[key];
                                        const missing = lookup.missing.includes(key);
                                        const reqd = lookup.already_requested.includes(key);
                                        return (
                                            <label
                                                key={key}
                                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    missing
                                                        ? 'border-teal-300 bg-white dark:bg-gray-800 hover:border-teal-500'
                                                        : 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 opacity-60 cursor-not-allowed'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    disabled={!missing}
                                                    checked={data.requested_fields.includes(key)}
                                                    onChange={() => toggleField(key)}
                                                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {existing ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-600">
                                                                <CheckCircleIcon className="w-3 h-3" /> Existing: {existing}
                                                            </span>
                                                        ) : reqd ? (
                                                            <span className="text-amber-600">Already in pending request</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-amber-600">
                                                                <ExclamationCircleIcon className="w-3 h-3" /> Missing
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Optional claimed times */}
                        {data.requested_fields.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Optional: enter the actual times (leave blank to use default schedule)
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {data.requested_fields.map((f) => (
                                        <div key={f}>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                {fields[f]}
                                            </label>
                                            <input
                                                type="time"
                                                value={data.requested_times[f] || ''}
                                                onChange={(e) =>
                                                    setData('requested_times', { ...data.requested_times, [f]: e.target.value })
                                                }
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reason / Explanation
                            </label>
                            <textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                rows={3}
                                placeholder="Why were these entries not captured?"
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>

                        {errors.requested_fields && (
                            <p className="text-sm text-red-600">{errors.requested_fields}</p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing || data.requested_fields.length === 0}
                                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                                Submit Request
                            </button>
                            <Link
                                href={route('trainee.attendance-requests.index')}
                                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </TraineeLayout>
    );
}