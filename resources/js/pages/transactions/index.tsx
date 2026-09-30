import { Head, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    FileText,
    History,
    KeyRound,
    RotateCcw,
    Search,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { ReturnModal } from '@/components/keytracker/return-modal';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Auth } from '@/types/auth';
import type { BorrowingItem, KeyItem, PaginatedData } from '@/types/keytracker';

type Props = {
    transactions: PaginatedData<BorrowingItem>;
    filters: {
        search: string;
        status: string;
        user_id: string;
        key_id: string;
        start_date: string;
        end_date: string;
    };
    users: { id: number; name: string; email: string; department: string | null }[];
    keys: { id: number; name: string; key_code: string }[];
};

export default function TransactionsIndex({ transactions, filters, users, keys }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const [search, setSearch] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [userFilter, setUserFilter] = useState(filters.user_id);
    const [keyFilter, setKeyFilter] = useState(filters.key_id);
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const [returnModalBorrowing, setReturnModalBorrowing] = useState<BorrowingItem | null>(null);

    const handleApplyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/transactions',
            {
                search,
                status: statusFilter,
                user_id: userFilter,
                key_id: keyFilter,
                start_date: startDate,
                end_date: endDate,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatusFilter('');
        setUserFilter('');
        setKeyFilter('');
        setStartDate('');
        setEndDate('');
        router.get('/transactions');
    };

    return (
        <>
            <Head title="Transaction History - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                Transaction History
                            </h1>
                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                {transactions.total} Transactions
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Comprehensive ledger of all key checkouts, returns, conditions, and overdue timestamps.
                        </p>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <form
                    onSubmit={handleApplyFilters}
                    className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search borrower, key, purpose..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-xs"
                            />
                        </div>

                        {/* Status */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="">All Statuses</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="overdue">Overdue</option>
                            <option value="returned">Returned</option>
                            <option value="pending">Pending</option>
                            <option value="lost">Lost</option>
                            <option value="damaged">Damaged</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* User Filter (Admin only) */}
                        {isAdmin ? (
                            <select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="">All Borrowers</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.department || 'Staff'})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                                Filtering: Your Checkouts Only
                            </div>
                        )}

                        {/* Key Filter */}
                        <select
                            value={keyFilter}
                            onChange={(e) => setKeyFilter(e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="">All Keys</option>
                            {keys.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.name} ({k.key_code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range & Submit Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <span>Date Filter:</span>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-36 text-xs h-8"
                            />
                            <span>to</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-36 text-xs h-8"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button type="submit" size="sm" className="h-8 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
                                Apply Filters
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="h-8 text-xs font-medium"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Transactions Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">Tx ID</th>
                                    <th className="py-3 px-4 font-semibold">Key & Location</th>
                                    <th className="py-3 px-4 font-semibold">Borrower</th>
                                    <th className="py-3 px-4 font-semibold">Purpose</th>
                                    <th className="py-3 px-4 font-semibold">Borrowed Date</th>
                                    <th className="py-3 px-4 font-semibold">Expected Return</th>
                                    <th className="py-3 px-4 font-semibold">Actual Return</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    {isAdmin && <th className="py-3 px-4 font-semibold text-right">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 9 : 8} className="py-12 text-center text-xs text-slate-400">
                                            No transactions match your search and filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <tr
                                            key={tx.id}
                                            className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                                                #{tx.id}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {tx.key?.name}
                                                </div>
                                                <div className="font-mono text-[10px] text-blue-700 dark:text-blue-300 uppercase">
                                                    {tx.key?.key_code}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {tx.user?.name}
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    {tx.user?.department || 'Staff'}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 max-w-xs text-slate-600 dark:text-slate-300">
                                                <div className="truncate" title={tx.purpose}>
                                                    {tx.purpose}
                                                </div>
                                                {tx.notes && (
                                                    <div className="text-[10px] text-slate-400 italic line-clamp-1">
                                                        Notes: {tx.notes}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                {tx.borrowed_at ? new Date(tx.borrowed_at).toLocaleDateString() : 'N/A'}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={tx.status === 'overdue' ? 'font-bold text-rose-600' : 'text-slate-600 dark:text-slate-400'}>
                                                    {tx.expected_return_at ? new Date(tx.expected_return_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                {tx.returned_at ? (
                                                    <div>
                                                        <div>{new Date(tx.returned_at).toLocaleDateString()}</div>
                                                        {tx.return_condition && (
                                                            <span className="text-[10px] font-medium text-emerald-600 uppercase">
                                                                ({tx.return_condition})
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <StatusBadge status={tx.status} />
                                            </td>

                                            {isAdmin && (
                                                <td className="py-3.5 px-4 text-right">
                                                    {(tx.status === 'borrowed' || tx.status === 'overdue') && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => setReturnModalBorrowing(tx)}
                                                            className="h-7 bg-blue-600 text-[11px] font-semibold text-white hover:bg-blue-700 shadow-xs"
                                                        >
                                                            <RotateCcw className="mr-1 size-3" />
                                                            Return
                                                        </Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-slate-500">
                                Showing {transactions.from} to {transactions.to} of {transactions.total} records
                            </span>
                            <div className="flex items-center gap-1">
                                {transactions.links.map((link, idx) => (
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

            {/* Return Modal */}
            <ReturnModal
                isOpen={Boolean(returnModalBorrowing)}
                onClose={() => setReturnModalBorrowing(null)}
                borrowing={returnModalBorrowing}
            />
        </>
    );
}

TransactionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transaction History', href: '/transactions' },
    ],
};

