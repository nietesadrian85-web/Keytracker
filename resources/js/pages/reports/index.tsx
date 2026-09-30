import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calendar,
    Download,
    Flame,
    KeyRound,
    Printer,
    RotateCcw,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    metrics: {
        total_transactions: number;
        borrowed: number;
        returned: number;
        overdue: number;
        lost: number;
        damaged: number;
    };
    mostBorrowedKeys: {
        key_id: number;
        key_name: string;
        key_code: string;
        location: string;
        borrow_count: number;
    }[];
    departmentBreakdown: {
        department: string;
        count: number;
    }[];
    filters: {
        range: string;
        start_date: string;
        end_date: string;
    };
};

export default function ReportsIndex({
    metrics,
    mostBorrowedKeys,
    departmentBreakdown,
    filters,
}: Props) {
    const [range, setRange] = useState(filters.range);
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const handleRangeChange = (newRange: string) => {
        setRange(newRange);
        router.get('/reports', { range: newRange }, { preserveState: true });
    };

    const handleCustomFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/reports',
            {
                range: 'custom',
                start_date: startDate,
                end_date: endDate,
            },
            { preserveState: true }
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const maxBorrowCount = Math.max(...mostBorrowedKeys.map((k) => k.borrow_count), 1);
    const maxDeptCount = Math.max(...departmentBreakdown.map((d) => d.count), 1);

    return (
        <>
            <Head title="Reports & Analytics - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8 print:p-0">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                Key Audit & Reports
                            </h1>
                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                Institutional Summary
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Physical security usage analytics, key circulation trends, and departmental volume.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                    >
                        <Printer className="mr-1.5 size-3.5" />
                        Print / Save PDF Report
                    </Button>
                </div>

                {/* Printable Header */}
                <div className="hidden print:block border-b border-slate-900 pb-4 mb-6">
                    <h1 className="text-2xl font-bold">KeyTracker – Key Management System Report</h1>
                    <p className="text-xs text-slate-600">
                        Generated on {new Date().toLocaleDateString()} · Campus Security & Facilities Directorate
                    </p>
                </div>

                {/* Date Range Selector Toolbar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 print:hidden space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'today', label: 'Today' },
                                { id: 'week', label: 'This Week' },
                                { id: 'month', label: 'This Month' },
                                { id: 'year', label: 'This Year' },
                                { id: 'all', label: 'All Time' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleRangeChange(tab.id)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                        range === tab.id
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleCustomFilter} className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500">Custom Date:</span>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-32 h-8 text-xs"
                                required
                            />
                            <span>to</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-32 h-8 text-xs"
                                required
                            />
                            <Button type="submit" size="sm" className="h-8 text-xs bg-slate-900 text-white hover:bg-slate-800">
                                Filter
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Key Metrics Overview */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Transactions</div>
                        <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                            {metrics.total_transactions}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">In selected period</div>
                    </div>

                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/40 p-4 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Borrowed Keys</div>
                        <div className="mt-2 text-2xl font-black text-blue-700 dark:text-blue-300">
                            {metrics.borrowed}
                        </div>
                        <div className="mt-1 text-[11px] text-blue-600/70">Checkouts active</div>
                    </div>

                    <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                        <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Returned Keys</div>
                        <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
                            {metrics.returned}
                        </div>
                        <div className="mt-1 text-[11px] text-emerald-600/70">Completed returns</div>
                    </div>

                    <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
                        <div className="text-xs font-medium text-rose-700 dark:text-rose-400">Overdue Keys</div>
                        <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">
                            {metrics.overdue}
                        </div>
                        <div className="mt-1 text-[11px] text-rose-600/70">Past due date</div>
                    </div>

                    <div className="rounded-xl border border-slate-300/80 bg-slate-100/50 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-800/30">
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Lost Keys</div>
                        <div className="mt-2 text-2xl font-black text-slate-800 dark:text-slate-200">
                            {metrics.lost}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">Misplaced</div>
                    </div>

                    <div className="rounded-xl border border-amber-200/70 bg-amber-50/40 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Damaged Keys</div>
                        <div className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">
                            {metrics.damaged}
                        </div>
                        <div className="mt-1 text-[11px] text-amber-600/70">Repair / Replace</div>
                    </div>
                </div>

                {/* 2 Visual Reports: Most Borrowed Keys & Department Breakdown */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Most Borrowed Keys Ranking */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                <Flame className="size-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Most Frequently Borrowed Keys
                            </h2>
                        </div>

                        {mostBorrowedKeys.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">
                                No key borrowing activity recorded for this period.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {mostBorrowedKeys.map((item, idx) => {
                                    const percentage = (item.borrow_count / maxBorrowCount) * 100;
                                    return (
                                        <div key={item.key_id} className="space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                        #{idx + 1}
                                                    </span>
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {item.key_name}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                                                        {item.key_code}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-blue-700 dark:text-blue-400">
                                                    {item.borrow_count} time{item.borrow_count !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                Location: {item.location}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Department Borrowing Breakdown */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                <Building2 className="size-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Key Checkouts by Department
                            </h2>
                        </div>

                        {departmentBreakdown.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400">
                                No department checkouts recorded for this period.
                            </div>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {departmentBreakdown.map((dept) => {
                                    const percentage = (dept.count / maxDeptCount) * 100;
                                    return (
                                        <div key={dept.department} className="space-y-1.5 text-xs">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {dept.department}
                                                </span>
                                                <span className="font-bold text-indigo-700 dark:text-indigo-400">
                                                    {dept.count} borrow{dept.count !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Reports & Analytics', href: '/reports' },
    ],
};

