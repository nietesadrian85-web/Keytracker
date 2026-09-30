import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    FolderGit2,
    KeyRound,
    Plus,
    RotateCcw,
    ShieldAlert,
    TrendingUp,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { BorrowModal } from '@/components/keytracker/borrow-modal';
import { ReturnModal } from '@/components/keytracker/return-modal';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types/auth';
import type { ActivityLogItem, BorrowingItem, KeyItem } from '@/types/keytracker';

type DashboardProps = {
    stats: {
        total_keys: number;
        available_keys: number;
        borrowed_keys: number;
        overdue_keys: number;
        lost_keys: number;
        damaged_keys: number;
        pending_requests: number;
    };
    recentActivity: ActivityLogItem[];
    pendingRequests: BorrowingItem[];
    overdueList: BorrowingItem[];
    recentReturned: BorrowingItem[];
    myActiveBorrowings: BorrowingItem[];
    statusBreakdown: { name: string; count: number; color: string }[];
    availableKeys?: KeyItem[];
};

export default function Dashboard({
    stats,
    recentActivity,
    pendingRequests,
    overdueList,
    recentReturned,
    myActiveBorrowings,
    statusBreakdown,
    availableKeys = [],
}: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [selectedReturnBorrowing, setSelectedReturnBorrowing] = useState<BorrowingItem | null>(null);

    const handleApprove = (borrowingId: number) => {
        router.post(`/borrowing/${borrowingId}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = (borrowingId: number) => {
        const reason = prompt('Please enter a rejection reason (optional):') ?? '';
        router.post(`/borrowing/${borrowingId}/reject`, { reason }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="KeyTracker Dashboard" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header Banner */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-md">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                            <KeyRound className="size-3.5" />
                            <span>Campus Key Management System</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                            Welcome back, {user.name}
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            {isAdmin
                                ? `Administrator Access – Overseeing ${stats.total_keys} keys across campus departments.`
                                : `${user.department || 'Staff Member'} – You have ${myActiveBorrowings.length} active key(s) in possession.`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            onClick={() => setIsBorrowModalOpen(true)}
                            className="bg-white font-semibold text-blue-900 hover:bg-blue-50 shadow-sm transition"
                        >
                            <Plus className="mr-1.5 size-4" />
                            Request a Key
                        </Button>
                        {isAdmin && (
                            <Link
                                href="/keys"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition"
                            >
                                <KeyRound className="size-3.5" />
                                Manage Inventory
                            </Link>
                        )}
                    </div>
                </div>

                {/* Overdue Alert Banner if any exist */}
                {stats.overdue_keys > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-200 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200">
                                <ShieldAlert className="size-5" />
                            </div>
                            <div>
                                <span className="font-bold">Attention: {stats.overdue_keys} Overdue Key(s) Detected!</span>
                                <p className="text-xs text-rose-700 dark:text-rose-300">
                                    Physical keys have exceeded their scheduled return date. Immediate return required.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/notifications"
                            className="text-xs font-bold text-rose-700 underline hover:text-rose-900 dark:text-rose-300"
                        >
                            View Alert Center →
                        </Link>
                    </div>
                )}

                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                    {/* Total Keys */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Keys</div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.total_keys}</div>
                        <div className="mt-1 text-[11px] text-slate-400">Catalogued</div>
                    </div>

                    {/* Available Keys */}
                    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Available</div>
                        <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">{stats.available_keys}</div>
                        <div className="mt-1 text-[11px] text-emerald-600/70">Ready to borrow</div>
                    </div>

                    {/* Borrowed Keys */}
                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-4 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Borrowed</div>
                        <div className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-300">{stats.borrowed_keys}</div>
                        <div className="mt-1 text-[11px] text-blue-600/70">In active use</div>
                    </div>

                    {/* Overdue Keys */}
                    <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
                        <div className="text-xs font-medium text-rose-700 dark:text-rose-400">Overdue</div>
                        <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">{stats.overdue_keys}</div>
                        <div className="mt-1 text-[11px] text-rose-600/70">Past due date</div>
                    </div>

                    {/* Lost Keys */}
                    <div className="rounded-xl border border-slate-300/80 bg-slate-100/50 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/30">
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Lost</div>
                        <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-200">{stats.lost_keys}</div>
                        <div className="mt-1 text-[11px] text-slate-500">Unaccounted</div>
                    </div>

                    {/* Damaged Keys */}
                    <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Damaged</div>
                        <div className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">{stats.damaged_keys}</div>
                        <div className="mt-1 text-[11px] text-amber-600/70">Needs replacement</div>
                    </div>

                    {/* Pending Requests */}
                    <div className="col-span-2 sm:col-span-1 rounded-xl border border-indigo-200/70 bg-indigo-50/40 p-4 shadow-xs dark:border-indigo-900/40 dark:bg-indigo-950/20">
                        <div className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Pending Requests</div>
                        <div className="mt-2 text-2xl font-black text-indigo-700 dark:text-indigo-300">{stats.pending_requests}</div>
                        <div className="mt-1 text-[11px] text-indigo-600/70">Awaiting approval</div>
                    </div>
                </div>

                {/* Status Distribution Visual Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-4 text-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Physical Keys Inventory Distribution
                            </h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                            {stats.total_keys} Total Items
                        </span>
                    </div>

                    <div className="mt-4 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        {statusBreakdown.map((item) => {
                            const percent = stats.total_keys > 0 ? (item.count / stats.total_keys) * 100 : 0;
                            if (percent <= 0) return null;
                            return (
                                <div
                                    key={item.name}
                                    style={{ width: `${percent}%`, backgroundColor: item.color }}
                                    title={`${item.name}: ${item.count} (${percent.toFixed(1)}%)`}
                                    className="transition-all hover:opacity-80"
                                />
                            );
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {statusBreakdown.map((item) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span>
                                    {item.name}: <strong className="text-slate-800 dark:text-slate-200">{item.count}</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: Pending Requests & Overdue Keys */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Pending Requests Queue (Admin Quick Action) */}
                        {isAdmin && (
                            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                            <UserCheck className="size-4" />
                                        </div>
                                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Pending Borrowing Requests
                                        </h2>
                                        {pendingRequests.length > 0 && (
                                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                                {pendingRequests.length}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href="/borrowing/requests"
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        View all requests →
                                    </Link>
                                </div>

                                {pendingRequests.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-slate-400">
                                        No pending borrowing requests right now.
                                    </div>
                                ) : (
                                    <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                                        {pendingRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {req.key?.name}
                                                        </span>
                                                        <span className="font-mono text-[10px] text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                                            {req.key?.key_code}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        Borrower: <strong className="text-slate-700 dark:text-slate-300">{req.user?.name}</strong>{' '}
                                                        ({req.user?.department || 'Staff'})
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Purpose: <span className="italic">{req.purpose}</span>
                                                    </div>
                                                    <div className="mt-0.5 text-[11px] text-slate-400">
                                                        Due by: {req.expected_return_at ? new Date(req.expected_return_at).toLocaleString() : 'N/A'}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(req.id)}
                                                        className="h-8 bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReject(req.id)}
                                                        className="h-8 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Overdue Keys Action Table */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                                        <AlertTriangle className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Overdue Keys Requiring Immediate Return
                                    </h2>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                    {overdueList.length} items
                                </span>
                            </div>

                            {overdueList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-slate-400">
                                    <CheckCircle2 className="size-8 text-emerald-500/60 mb-2" />
                                    <span>All borrowed keys are currently on track! No overdue keys.</span>
                                </div>
                            ) : (
                                <div className="mt-3 overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider dark:border-slate-800">
                                                <th className="pb-2 font-semibold">Key</th>
                                                <th className="pb-2 font-semibold">Borrower</th>
                                                <th className="pb-2 font-semibold">Scheduled Due Date</th>
                                                <th className="pb-2 font-semibold">Status</th>
                                                {isAdmin && <th className="pb-2 font-semibold text-right">Action</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {overdueList.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                                    <td className="py-2.5 font-medium text-slate-900 dark:text-white">
                                                        <div>{item.key?.name}</div>
                                                        <span className="font-mono text-[10px] text-slate-500 uppercase">
                                                            {item.key?.key_code}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 text-slate-600 dark:text-slate-400">
                                                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {item.user?.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            {item.user?.department || 'Staff'}
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 font-semibold text-rose-600 dark:text-rose-400">
                                                        {item.expected_return_at
                                                            ? new Date(item.expected_return_at).toLocaleDateString(undefined, {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="py-2.5">
                                                        <StatusBadge status="overdue" />
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="py-2.5 text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setSelectedReturnBorrowing(item)}
                                                                className="h-7 bg-blue-600 text-[11px] font-semibold text-white hover:bg-blue-700 shadow-xs"
                                                            >
                                                                <RotateCcw className="mr-1 size-3" />
                                                                Return Key
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Recent Returned Keys */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                                        <RotateCcw className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Recent Returned Keys
                                    </h2>
                                </div>
                                <Link
                                    href="/transactions"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    View ledger →
                                </Link>
                            </div>

                            {recentReturned.length === 0 ? (
                                <div className="py-6 text-center text-xs text-slate-400">
                                    No key returns recorded yet.
                                </div>
                            ) : (
                                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                                    {recentReturned.map((ret) => (
                                        <div key={ret.id} className="flex items-center justify-between py-2.5 text-xs">
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {ret.key?.name} ({ret.key?.key_code})
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    Returned by {ret.user?.name} · Condition: <span className="font-medium capitalize">{ret.return_condition || 'Good'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={ret.return_condition === 'damaged' ? 'damaged' : 'returned'} />
                                                <div className="text-[10px] text-slate-400 mt-1">
                                                    {ret.returned_at ? new Date(ret.returned_at).toLocaleDateString() : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: User's Active Keys & Audit Activity Feed */}
                    <div className="space-y-6">
                        {/* My Active Keys Widget */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                        <KeyRound className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        My Active Keys
                                    </h2>
                                </div>
                                <Link
                                    href="/borrowing/my-keys"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    Details →
                                </Link>
                            </div>

                            {myActiveBorrowings.length === 0 ? (
                                <div className="py-8 text-center text-xs text-slate-400">
                                    You currently don't hold any borrowed keys.
                                    <div className="mt-3">
                                        <Button
                                            size="sm"
                                            onClick={() => setIsBorrowModalOpen(true)}
                                            className="h-8 bg-blue-600 text-xs text-white hover:bg-blue-700"
                                        >
                                            Request Key Now
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 space-y-2.5">
                                    {myActiveBorrowings.map((b) => (
                                        <div
                                            key={b.id}
                                            className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    {b.key?.name}
                                                </span>
                                                <StatusBadge status={b.status} />
                                            </div>
                                            <div className="mt-1 text-[11px] text-slate-500">
                                                Location: {b.key?.location}
                                            </div>
                                            <div className="mt-1 flex items-center justify-between text-[11px]">
                                                <span className="text-slate-400">Due:</span>
                                                <span className={`font-semibold ${b.status === 'overdue' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {b.expected_return_at ? new Date(b.expected_return_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Log Feed */}
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        <Clock className="size-4" />
                                    </div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Recent Activity
                                    </h2>
                                </div>
                                <span className="text-[11px] text-slate-400">Live Audit</span>
                            </div>

                            {recentActivity.length === 0 ? (
                                <div className="py-6 text-center text-xs text-slate-400">
                                    No activity logs recorded yet.
                                </div>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    {recentActivity.map((log) => (
                                        <div key={log.id} className="flex gap-2.5 text-xs">
                                            <div className="mt-1 size-1.5 shrink-0 rounded-full bg-blue-600" />
                                            <div>
                                                <p className="text-slate-700 dark:text-slate-300 leading-snug">
                                                    {log.description}
                                                </p>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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

            <ReturnModal
                isOpen={Boolean(selectedReturnBorrowing)}
                onClose={() => setSelectedReturnBorrowing(null)}
                borrowing={selectedReturnBorrowing}
            />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
