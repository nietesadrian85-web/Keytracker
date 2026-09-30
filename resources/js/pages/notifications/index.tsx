import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Bell,
    CheckCircle2,
    Clock,
    KeyRound,
    RotateCcw,
    ShieldAlert,
    User,
} from 'lucide-react';
import { StatusBadge } from '@/components/keytracker/status-badge';
import type { Auth } from '@/types/auth';
import type { ActivityLogItem, BorrowingItem } from '@/types/keytracker';

type Props = {
    overdueItems: BorrowingItem[];
    pendingItems: BorrowingItem[];
    issueItems: BorrowingItem[];
    logs: ActivityLogItem[];
};

export default function NotificationsIndex({
    overdueItems,
    pendingItems,
    issueItems,
    logs,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const totalAlerts = overdueItems.length + pendingItems.length + issueItems.length;

    return (
        <>
            <Head title="Notifications & Alerts - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                System Alerts & Audit
                            </h1>
                            {totalAlerts > 0 && (
                                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
                                    {totalAlerts} Active Alert{totalAlerts !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Central monitoring center for overdue keys, security exceptions, pending requests, and operational audits.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: Active Alert Feeds */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Overdue Alerts */}
                        <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs dark:border-rose-900/50 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-rose-100 pb-3 dark:border-rose-900/40">
                                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                    <ShieldAlert className="size-4" />
                                    <h2 className="text-sm font-bold">
                                        Overdue Key Returns ({overdueItems.length})
                                    </h2>
                                </div>
                                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                                    Immediate Attention Required
                                </span>
                            </div>

                            {overdueItems.length === 0 ? (
                                <div className="py-6 text-center text-xs text-slate-400">
                                    No overdue keys. All borrowed keys are within their return schedules.
                                </div>
                            ) : (
                                <div className="mt-3 divide-y divide-rose-50 dark:divide-rose-950/40">
                                    {overdueItems.map((item) => (
                                        <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {item.key?.name}
                                                    </span>
                                                    <span className="font-mono text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                                                        {item.key?.key_code}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-slate-600 dark:text-slate-400">
                                                    Held by <strong>{item.user?.name}</strong> ({item.user?.department || 'Staff'})
                                                </div>
                                                <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
                                                    Was due: {item.expected_return_at ? new Date(item.expected_return_at).toLocaleString() : 'N/A'}
                                                </div>
                                            </div>

                                            {isAdmin && (
                                                <Link
                                                    href="/transactions"
                                                    className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs"
                                                >
                                                    View in Ledger
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pending Approvals */}
                        {isAdmin && (
                            <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs dark:border-indigo-900/50 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-indigo-100 pb-3 dark:border-indigo-900/40">
                                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                        <Clock className="size-4" />
                                        <h2 className="text-sm font-bold">
                                            Awaiting Authorization ({pendingItems.length})
                                        </h2>
                                    </div>
                                    <Link
                                        href="/borrowing/requests"
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                    >
                                        Go to Requests Queue →
                                    </Link>
                                </div>

                                {pendingItems.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-slate-400">
                                        No pending borrowing requests in queue.
                                    </div>
                                ) : (
                                    <div className="mt-3 divide-y divide-indigo-50 dark:divide-indigo-950/40">
                                        {pendingItems.map((item) => (
                                            <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                                                <div>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {item.user?.name}
                                                    </span>{' '}
                                                    requested{' '}
                                                    <strong className="text-indigo-700 dark:text-indigo-400">
                                                        {item.key?.name}
                                                    </strong>{' '}
                                                    ({item.key?.key_code})
                                                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                                                        Purpose: "{item.purpose}"
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 shrink-0">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lost / Damaged Issues */}
                        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-xs dark:border-amber-900/50 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-amber-100 pb-3 dark:border-amber-900/40">
                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                    <AlertTriangle className="size-4" />
                                    <h2 className="text-sm font-bold">
                                        Reported Key Issues ({issueItems.length})
                                    </h2>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                    Lost & Damaged Physical Keys
                                </span>
                            </div>

                            {issueItems.length === 0 ? (
                                <div className="py-6 text-center text-xs text-slate-400">
                                    No reported key issues or damages.
                                </div>
                            ) : (
                                <div className="mt-3 divide-y divide-amber-50 dark:divide-amber-950/40">
                                    {issueItems.map((item) => (
                                        <div key={item.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {item.key?.name}
                                                    </span>
                                                    <StatusBadge status={item.status} />
                                                </div>
                                                <div className="text-slate-600 dark:text-slate-400 mt-1">
                                                    Reported by {item.user?.name} · {item.notes || 'No description provided'}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {new Date(item.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Full Activity Log */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-4 text-blue-600" />
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Audit Activity Log
                                    </h2>
                                </div>
                                <span className="text-[11px] text-slate-400">Security Trail</span>
                            </div>

                            {logs.length === 0 ? (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    No activity records.
                                </div>
                            ) : (
                                <div className="mt-4 space-y-3.5">
                                    {logs.map((log) => (
                                        <div key={log.id} className="flex gap-2.5 text-xs">
                                            <div className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-600" />
                                            <div>
                                                <div className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                                                    {log.description}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                                    <span>{new Date(log.created_at).toLocaleString()}</span>
                                                    <span>·</span>
                                                    <span className="font-mono uppercase">{log.action}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notifications', href: '/notifications' },
    ],
};

