import React from 'react';

type StatusType =
    | 'available'
    | 'borrowed'
    | 'overdue'
    | 'lost'
    | 'damaged'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'returned'
    | 'active'
    | 'inactive'
    | 'good'
    | 'missing'
    | string;

export function StatusBadge({ status, className = '' }: { status: StatusType; className?: string }) {
    const s = (status || '').toLowerCase();

    let style = 'bg-slate-100 text-slate-700 border-slate-200';
    let dot = 'bg-slate-400';
    let label = status;

    switch (s) {
        case 'available':
            style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            dot = 'bg-emerald-500';
            label = 'Available';
            break;
        case 'borrowed':
            style = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
            dot = 'bg-blue-500';
            label = 'Borrowed';
            break;
        case 'overdue':
            style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 animate-pulse';
            dot = 'bg-rose-500';
            label = 'Overdue';
            break;
        case 'lost':
            style = 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
            dot = 'bg-zinc-500';
            label = 'Lost';
            break;
        case 'damaged':
            style = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
            dot = 'bg-amber-500';
            label = 'Damaged';
            break;
        case 'pending':
            style = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
            dot = 'bg-indigo-500';
            label = 'Pending Approval';
            break;
        case 'approved':
            style = 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800';
            dot = 'bg-cyan-500';
            label = 'Approved';
            break;
        case 'rejected':
            style = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800';
            dot = 'bg-red-400';
            label = 'Rejected';
            break;
        case 'returned':
            style = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';
            dot = 'bg-teal-500';
            label = 'Returned';
            break;
        case 'active':
            style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            dot = 'bg-emerald-500';
            label = 'Active';
            break;
        case 'inactive':
            style = 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400';
            dot = 'bg-slate-400';
            label = 'Inactive';
            break;
        case 'good':
            style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            dot = 'bg-emerald-500';
            label = 'Good Condition';
            break;
        case 'missing':
            style = 'bg-zinc-100 text-zinc-700 border-zinc-300';
            dot = 'bg-zinc-500';
            label = 'Missing';
            break;
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${style} ${className}`}
        >
            <span className={`size-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
}

