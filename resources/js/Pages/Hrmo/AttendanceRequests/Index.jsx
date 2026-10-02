import HrmoLayout from '@/Layouts/HrmoLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    EyeIcon,
    ClipboardDocumentCheckIcon,
    InboxIcon,
} from '@heroicons/react/24/outline';

const STATUS_TABS = [
    { key: 'pending',        label: 'Pending' },
    { key: 'pending_letter', label: 'Awaiting Letter' },
    { key: 'approved',       label: 'Approved' },
    { key: 'rejected',       label: 'Rejected' },
    { key: 'all',            label: 'All' },
];

const BADGE = {
    pending_letter: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    pending:        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    approved:       'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    rejected:       'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
};

const STATUS_LABEL = {
    pending_letter: 'Awaiting letter',
    pending:        'Pending',
    approved:       'Approved',
    rejected:       'Rejected',
};

export default function Index({ requests, filters, counts }) {
    const data = requests ?? { data: [], links: [], from: 0, to: 0, total: 0 };

    function switchTab(status) {
        router.get(route('hrmo.attendance-requests.index'), { status }, { preserveState: true });
    }

    return (
        <HrmoLayout header={<h2 className="font-semibold text-xl text-slate-800 dark:text-slate-200">Attendance Requests</h2>}>
            <Head title="Attendance Requests" />
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* ============ HEADER ============ */}
                    <div className="mb-5 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-xl border border-teal-100 dark:border-teal-800/40 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <ClipboardDocumentCheckIcon className="w-8 h-8 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Trainee Attendance Correction Requests
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                    Review signed letters and approve legitimate corrections. Approved requests
                                    automatically fill the missing attendance slots.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ============ TABS ============ */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {STATUS_TABS.map((tab) => {
                            const active = filters?.status === tab.key;
                            const count = counts?.[tab.key];
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => switchTab(tab.key)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                                        active
                                            ? 'bg-teal-600 text-white border-teal-600'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {tab.label}
                                    {typeof count === 'number' && (
                                        <span
                                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                                active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ============ TABLE ============ */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        {data.data.length === 0 ? (
                            <div className="p-12 text-center">
                                <InboxIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    No requests in this category
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Requests submitted by trainees will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ref</th>
                                            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trainee</th>
                                            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Requested Fields</th>
                                            <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Letter</th>
                                            <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {data.data.map((r) => (
                                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    AR-{String(r.id).padStart(6, '0')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-800 dark:text-slate-200 uppercase">
                                                        {r.trainee}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {r.department}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                    {r.date}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {r.field_labels?.map((label, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-1.5 py-0.5 text-[10px] rounded bg-teal-50 text-teal-700 ring-1 ring-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:ring-teal-800"
                                                            >
                                                                {label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {r.has_image ? (
                                                        <span
                                                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30"
                                                            title="Signed letter uploaded"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700"
                                                            title="Signed letter not uploaded yet"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-block px-2 py-0.5 text-[11px] rounded-full font-medium whitespace-nowrap ${BADGE[r.status] || BADGE.pending_letter}`}
                                                    >
                                                        {STATUS_LABEL[r.status] || r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={route('hrmo.attendance-requests.show', r.id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                                                    >
                                                        <EyeIcon className="w-3.5 h-3.5" />
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ============ PAGINATION ============ */}
                        {data.links && data.links.length > 3 && (
                            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Showing {data.from}–{data.to} of {data.total}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {data.links.map((l, i) => (
                                        <Link
                                            key={i}
                                            href={l.url || '#'}
                                            className={`px-2.5 py-1 rounded text-xs transition-colors ${
                                                l.active
                                                    ? 'bg-teal-600 text-white'
                                                    : l.url
                                                    ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: l.label }}
                                            onClick={(e) => {
                                                if (!l.url) e.preventDefault();
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </HrmoLayout>
    );
}