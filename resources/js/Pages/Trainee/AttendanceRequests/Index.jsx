import TraineeLayout from '@/Layouts/TraineeLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    PlusIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

const STATUS_BADGE = {
    pending_letter: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    pending:        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    approved:       'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected:       'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
};

const STATUS_LABEL = {
    pending_letter: 'Needs signed letter',
    pending:        'Pending HRMO review',
    approved:       'Approved',
    rejected:       'Rejected',
};

export default function Index({ requests }) {
    const [uploadingFor, setUploadingFor] = useState(null);
    const fileRefs = useRef({});

    function uploadImage(id) {
        const input = fileRefs.current[id];
        if (!input || !input.files[0]) return;

        const formData = new FormData();
        formData.append('image', input.files[0]);

        router.post(route('trainee.attendance-requests.upload', id), formData, {
            forceFormData: true,
            onFinish: () => {
                setUploadingFor(null);
                if (fileRefs.current[id]) fileRefs.current[id].value = '';
            },
        });
    }

    return (
        <TraineeLayout header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">Attendance Requests</h2>}>
            <Head title="Attendance Requests" />
            <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Attendance Correction Requests</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Submit a request when a scan is missing or incomplete.
                            </p>
                        </div>
                        <Link
                            href={route('trainee.attendance-requests.create')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm"
                        >
                            <PlusIcon className="w-4 h-4" /> New Request
                        </Link>
                    </div>

                    {requests.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
                            <ClockIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                You haven't submitted any requests yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map((r) => (
                                <div
                                    key={r.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {r.date}{' '}
                                                <span className="text-xs font-normal text-gray-400">
                                                    · AR-{String(r.id).padStart(6, '0')}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Submitted {r.created_at}
                                            </p>
                                        </div>
                                        <span
                                            className={`self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-medium ${
                                                STATUS_BADGE[r.status] || STATUS_BADGE.pending_letter
                                            }`}
                                        >
                                            {STATUS_LABEL[r.status] || r.status}
                                        </span>
                                    </div>

                                    {/* Requested field chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {r.field_labels.map((label, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:ring-teal-800"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>

                                    {r.reason && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic">
                                            "{r.reason}"
                                        </p>
                                    )}

                                    {r.status === 'rejected' && r.review_notes && (
                                        <div className="mb-3 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 rounded-lg p-2.5">
                                            <XCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>
                                                <strong>HRMO note:</strong> {r.review_notes}
                                            </span>
                                        </div>
                                    )}

                                    {r.status === 'approved' && (
                                        <div className="mb-3 flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-2.5">
                                            <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>Attendance has been recorded.</span>
                                        </div>
                                    )}

                                    {(r.status === 'pending_letter' || r.status === 'pending') && (
                                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <a
                                                href={route('trainee.attendance-requests.letter', r.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Download Letter
                                            </a>

                                            {!r.has_image ? (
                                                uploadingFor === r.id ? (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={(el) => (fileRefs.current[r.id] = el)}
                                                            className="text-xs"
                                                        />
                                                        <button
                                                            onClick={() => uploadImage(r.id)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                                        >
                                                            Upload
                                                        </button>
                                                        <button
                                                            onClick={() => setUploadingFor(null)}
                                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setUploadingFor(r.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                                    >
                                                        <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Upload Signed Letter
                                                    </button>
                                                )
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg">
                                                    <CheckCircleIcon className="w-3.5 h-3.5" /> Signed letter uploaded
                                                </span>
                                            )}

                                            <button
                                                onClick={() => {
                                                    if (confirm('Cancel this request?')) {
                                                        router.delete(
                                                            route('trainee.attendance-requests.destroy', r.id)
                                                        );
                                                    }
                                                }}
                                                className="sm:ml-auto text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-2"
                                            >
                                                Cancel request
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TraineeLayout>
    );
}