import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    Check,
    CheckCircle2,
    CheckSquare,
    Clock,
    FileText,
    KeyRound,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { ReturnModal } from '@/components/keytracker/return-modal';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import type { BorrowingItem, KeyItem, PaginatedData } from '@/types/keytracker';

type Props = {
    requests: PaginatedData<BorrowingItem>;
    availableKeys: KeyItem[];
};

export default function BorrowingRequests({ requests, availableKeys }: Props) {
    const handleApprove = (borrowingId: number) => {
        router.post(`/borrowing/${borrowingId}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (borrowingId: number) => {
        const reason = prompt('Enter a reason for rejection (optional):') ?? '';
        router.post(`/borrowing/${borrowingId}/reject`, { reason }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Borrowing Requests - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                Borrowing Requests Queue
                            </h1>
                            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                                {requests.total} Pending
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Review and authorize faculty & staff requests for campus room and facility keys.
                        </p>
                    </div>
                </div>

                {/* Queue Cards / Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    {requests.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-xs text-slate-400">
                            <CheckCircle2 className="size-10 text-emerald-500/60 mb-3" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                All Caught Up!
                            </span>
                            <span className="mt-1">
                                There are no pending key borrowing requests awaiting your approval right now.
                            </span>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {requests.data.map((req) => (
                                <div
                                    key={req.id}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                >
                                    <div className="space-y-2 max-w-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                                <KeyRound className="size-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {req.key?.name}
                                                    </span>
                                                    <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                                        {req.key?.key_code}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    Location: {req.key?.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 p-3 rounded-xl dark:bg-slate-800/50">
                                            <div className="flex items-center gap-2">
                                                <User className="size-3.5 text-slate-400" />
                                                <span>
                                                    Borrower:{' '}
                                                    <strong className="text-slate-900 dark:text-white font-semibold">
                                                        {req.user?.name}
                                                    </strong>{' '}
                                                    ({req.user?.department || 'Staff'})
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock className="size-3.5 text-slate-400" />
                                                <span>
                                                    Expected Return:{' '}
                                                    <strong className="text-slate-900 dark:text-white font-semibold">
                                                        {req.expected_return_at
                                                            ? new Date(req.expected_return_at).toLocaleString(undefined, {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : 'N/A'}
                                                    </strong>
                                                </span>
                                            </div>

                                            <div className="sm:col-span-2 flex items-start gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                                                <FileText className="size-3.5 text-slate-400 mt-0.5" />
                                                <span>
                                                    Purpose:{' '}
                                                    <span className="italic text-slate-700 dark:text-slate-300">
                                                        "{req.purpose}"
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-[11px] text-slate-400">
                                            Requested on: {new Date(req.created_at).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col items-center gap-2 shrink-0">
                                        <Button
                                            onClick={() => handleApprove(req.id)}
                                            className="w-full bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                                        >
                                            <Check className="mr-1.5 size-4" />
                                            Approve Request
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => handleReject(req.id)}
                                            className="w-full text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                                        >
                                            <X className="mr-1.5 size-4" />
                                            Reject Request
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {requests.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-slate-500">
                                Showing page {requests.current_page} of {requests.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {requests.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white font-bold'
                                                : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

BorrowingRequests.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Borrowing Requests', href: '/borrowing/requests' },
    ],
};

