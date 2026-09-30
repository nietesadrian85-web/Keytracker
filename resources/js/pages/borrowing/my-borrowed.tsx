import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    History,
    KeyRound,
    Plus,
    ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';
import { BorrowModal } from '@/components/keytracker/borrow-modal';
import { ReportIssueModal } from '@/components/keytracker/report-issue-modal';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import type { BorrowingItem, KeyItem, PaginatedData } from '@/types/keytracker';

type Props = {
    activeBorrowings: BorrowingItem[];
    historyBorrowings: PaginatedData<BorrowingItem>;
    availableKeys: KeyItem[];
};

export default function MyBorrowedKeys({
    activeBorrowings,
    historyBorrowings,
    availableKeys,
}: Props) {
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [reportIssueBorrowing, setReportIssueBorrowing] = useState<BorrowingItem | null>(null);

    return (
        <>
            <Head title="My Borrowed Keys - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                            My Borrowed Keys
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Track the physical keys in your custody, scheduled return times, and past checkouts.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsBorrowModalOpen(true)}
                        className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                        <Plus className="mr-1.5 size-3.5" />
                        Request New Key
                    </Button>
                </div>

                {/* Currently Active Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <KeyRound className="size-4 text-blue-600" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Currently in Your Possession ({activeBorrowings.length})
                        </h2>
                    </div>

                    {activeBorrowings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900">
                            <CheckCircle2 className="size-8 text-emerald-500/60 mx-auto mb-2" />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                You currently have no keys checked out.
                            </span>
                            <div className="mt-2">
                                <Button
                                    size="sm"
                                    onClick={() => setIsBorrowModalOpen(true)}
                                    className="bg-blue-600 text-xs text-white hover:bg-blue-700"
                                >
                                    Browse Available Keys
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {activeBorrowings.map((b) => {
                                const isOverdue = b.status === 'overdue';
                                const isPending = b.status === 'pending';

                                return (
                                    <div
                                        key={b.id}
                                        className={`rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between ${
                                            isOverdue
                                                ? 'border-rose-300 bg-rose-50/50 dark:border-rose-900/60 dark:bg-rose-950/20'
                                                : isPending
                                                ? 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/40 dark:bg-indigo-950/20'
                                                : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
                                                        {b.key?.key_code}
                                                    </span>
                                                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                                                        {b.key?.name}
                                                    </h3>
                                                    <span className="text-xs text-slate-500">
                                                        {b.key?.location}
                                                    </span>
                                                </div>
                                                <StatusBadge status={b.status} />
                                            </div>

                                            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-3.5 text-slate-400 shrink-0" />
                                                    <span>
                                                        Borrowed:{' '}
                                                        <strong>
                                                            {b.borrowed_at
                                                                ? new Date(b.borrowed_at).toLocaleDateString()
                                                                : 'Pending Approval'}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                                                    <span className={isOverdue ? 'font-bold text-rose-600' : ''}>
                                                        Due by:{' '}
                                                        {b.expected_return_at
                                                            ? new Date(b.expected_return_at).toLocaleString()
                                                            : 'N/A'}
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2 italic text-slate-500 pt-1">
                                                    <FileText className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">"{b.purpose}"</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            {isOverdue && (
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                                                    <ShieldAlert className="size-4" />
                                                    <span>Overdue! Please return key</span>
                                                </div>
                                            )}

                                            {!isPending && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setReportIssueBorrowing(b)}
                                                    className="ml-auto h-7 text-[11px] font-semibold text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30"
                                                >
                                                    <AlertTriangle className="mr-1 size-3" />
                                                    Report Lost or Damaged
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                        <History className="size-4 text-slate-500" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Personal Checkout History
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="py-3 px-4 font-semibold">Key</th>
                                        <th className="py-3 px-4 font-semibold">Purpose</th>
                                        <th className="py-3 px-4 font-semibold">Borrowed Date</th>
                                        <th className="py-3 px-4 font-semibold">Returned Date</th>
                                        <th className="py-3 px-4 font-semibold">Condition</th>
                                        <th className="py-3 px-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {historyBorrowings.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                                                No previous borrowing transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        historyBorrowings.data.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">
                                                        {h.key?.name}
                                                    </div>
                                                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                        {h.key?.key_code}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                                    {h.purpose}
                                                </td>
                                                <td className="py-3 px-4 text-slate-500">
                                                    {h.borrowed_at ? new Date(h.borrowed_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-3 px-4 text-slate-500">
                                                    {h.returned_at ? new Date(h.returned_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="py-3 px-4 capitalize font-medium">
                                                    {h.return_condition ? (
                                                        <StatusBadge status={h.return_condition} />
                                                    ) : (
                                                        '—'
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <StatusBadge status={h.status} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <BorrowModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                availableKeys={availableKeys}
            />

            <ReportIssueModal
                isOpen={Boolean(reportIssueBorrowing)}
                onClose={() => setReportIssueBorrowing(null)}
                borrowing={reportIssueBorrowing}
            />
        </>
    );
}

MyBorrowedKeys.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Borrowed Keys', href: '/borrowing/my-keys' },
    ],
};

