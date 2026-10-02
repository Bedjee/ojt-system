import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowLeftIcon, CheckCircleIcon, XCircleIcon,
    DocumentMagnifyingGlassIcon, PhotoIcon,
} from '@heroicons/react/24/outline';

const FIELD_LABELS = {
    morning_time_in:   'Morning Time In',
    lunch_time_out:    'Morning Time Out (Lunch)',
    afternoon_time_in: 'Afternoon Time In',
    time_out:          'Time Out (End of Day)',
};

export default function Show({ request, existingAttendance }) {
    const [showImage, setShowImage] = useState(false);

    const approveForm = useForm({ review_notes: '' });
    const rejectForm  = useForm({ review_notes: '' });

    function approve() {
        if (!confirm('Approve this request and record attendance?')) return;
        approveForm.post(route('hrmo.attendance-requests.approve', request.id));
    }
    function reject() {
        if (!rejectForm.data.review_notes.trim()) return alert('Please provide a reason for rejection.');
        rejectForm.post(route('hrmo.attendance-requests.reject', request.id));
    }

    const isPending = request.status === 'pending';
    const isReviewed = ['approved', 'rejected'].includes(request.status);

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-slate-800 dark:text-slate-200">Review Request</h2>}>
            <Head title={`Review AR-${String(request.id).padStart(6, '0')}`} />
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link href={route('hrmo.attendance-requests.index')} className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to list
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Left: details */}
                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <DocumentMagnifyingGlassIcon className="w-5 h-5 text-teal-600" />
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        AR-{String(request.id).padStart(6, '0')}
                                    </h3>
                                </div>

                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                    <div>
                                        <dt className="text-xs text-slate-500 uppercase tracking-wider">Trainee</dt>
                                        <dd className="font-medium text-slate-800 dark:text-slate-200 uppercase mt-0.5">{request.trainee}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500 uppercase tracking-wider">Department</dt>
                                        <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{request.department}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500 uppercase tracking-wider">Date</dt>
                                        <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{request.date}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500 uppercase tracking-wider">Submitted</dt>
                                        <dd className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{request.created_at}</dd>
                                    </div>
                                </dl>

                                {request.reason && (
                                    <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="font-medium">Reason: </span>{request.reason}
                                    </div>
                                )}
                            </div>

                            {/* Fields comparison */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                                    Requested Fields vs. Existing Values
                                </h4>
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {Object.keys(FIELD_LABELS).map((key) => {
                                        const requested = request.fields.includes(key);
                                        const existing = existingAttendance[key];
                                        const claimed = request.requested_times?.[key];
                                        return (
                                            <div key={key} className="py-2.5 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {FIELD_LABELS[key]}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                        {existing ? `Existing: ${existing}` : 'No existing value'}
                                                        {requested && claimed && ` · Trainee claims ${claimed}`}
                                                    </p>
                                                </div>
                                                {requested ? (
                                                    <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                                                        Requested
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-500">
                                                        —
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Review form */}
                            {isPending && (
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Decision</h4>

                                    <textarea
                                        value={approveForm.data.review_notes}
                                        onChange={(e) => {
                                            approveForm.setData('review_notes', e.target.value);
                                            rejectForm.setData('review_notes', e.target.value);
                                        }}
                                        placeholder="Optional notes for approval / required for rejection..."
                                        rows={3}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 text-sm"
                                    />

                                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                        <button
                                            onClick={approve}
                                            disabled={approveForm.processing}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                        >
                                            <CheckCircleIcon className="w-4 h-4" /> Approve & Record Attendance
                                        </button>
                                        <button
                                            onClick={reject}
                                            disabled={rejectForm.processing}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                        >
                                            <XCircleIcon className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isReviewed && request.review_notes && (
                                <div className={`rounded-xl border p-4 text-sm ${
                                    request.status === 'approved'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                        : 'bg-rose-50 border-rose-200 text-rose-800'
                                }`}>
                                    <p className="font-medium mb-1">
                                        {request.status === 'approved' ? 'Approved' : 'Rejected'}
                                        {request.reviewer && ` by ${request.reviewer}`}
                                        {request.reviewed_at && ` · ${request.reviewed_at}`}
                                    </p>
                                    <p>{request.review_notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Right: verification image */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <PhotoIcon className="w-4 h-4" /> Signed Letter
                            </h4>
                            {request.image_url ? (
                                <>
                                    <button
                                        onClick={() => setShowImage(true)}
                                        className="block w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors"
                                    >
                                        <img src={request.image_url} alt="Verification" className="w-full h-auto" />
                                    </button>
                                    <p className="text-xs text-slate-500 mt-2 text-center">Click to enlarge</p>
                                </>
                            ) : (
                                <div className="py-10 text-center text-xs text-slate-500 dark:text-slate-400">
                                    No signed letter uploaded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {showImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setShowImage(false)}
                >
                    <img src={request.image_url} alt="Verification" className="max-w-full max-h-full rounded-lg" />
                </div>
            )}
        </HrmoLayout>
    );
}