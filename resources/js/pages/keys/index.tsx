import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertOctagon,
    AlertTriangle,
    Check,
    Filter,
    KeyRound,
    MapPin,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { BorrowModal } from '@/components/keytracker/borrow-modal';
import { KeyModal } from '@/components/keytracker/key-modal';
import { MarkLostDamagedModal } from '@/components/keytracker/mark-lost-damaged-modal';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Auth } from '@/types/auth';
import type { KeyItem, PaginatedData } from '@/types/keytracker';

type Props = {
    keys: PaginatedData<KeyItem>;
    filters: {
        search: string;
        status: string;
        key_type: string;
    };
    keyTypes: string[];
    locations: string[];
    availableKeys?: KeyItem[];
};

export default function KeysIndex({ keys, filters, keyTypes, locations, availableKeys = [] }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const [search, setSearch] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState(filters.status);
    const [typeFilter, setTypeFilter] = useState(filters.key_type);

    // Modals
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [selectedKeyForEdit, setSelectedKeyForEdit] = useState<KeyItem | null>(null);

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [borrowKeyId, setBorrowKeyId] = useState<number | null>(null);

    const [lostDamagedKey, setLostDamagedKey] = useState<KeyItem | null>(null);
    const [lostDamagedMode, setLostDamagedMode] = useState<'lost' | 'damaged'>('lost');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/keys',
            {
                search,
                status: statusFilter,
                key_type: typeFilter,
            },
            { preserveState: true }
        );
    };

    const handleFilterChange = (newStatus: string, newType: string) => {
        setStatusFilter(newStatus);
        setTypeFilter(newType);
        router.get(
            '/keys',
            {
                search,
                status: newStatus,
                key_type: newType,
            },
            { preserveState: true }
        );
    };

    const handleDelete = (keyItem: KeyItem) => {
        if (confirm(`Are you sure you want to permanently delete key '${keyItem.name}' (${keyItem.key_code})?`)) {
            router.delete(`/keys/${keyItem.id}`, { preserveScroll: true });
        }
    };

    const availableKeysList = availableKeys.length > 0 ? availableKeys : keys.data.filter((k) => k.status === 'available');

    return (
        <>
            <Head title="Keys Inventory - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                Keys Inventory
                            </h1>
                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                {keys.total} Keys
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Search, manage, and track physical keys, locations, and checkout availability.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => {
                                setBorrowKeyId(null);
                                setIsBorrowModalOpen(true);
                            }}
                            className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                            <KeyRound className="mr-1.5 size-3.5" />
                            Request Key
                        </Button>

                        {isAdmin && (
                            <Button
                                onClick={() => {
                                    setSelectedKeyForEdit(null);
                                    setIsKeyModalOpen(true);
                                }}
                                className="bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Add New Key
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by key code, name, room, or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-xs"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => handleFilterChange(e.target.value, typeFilter)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="">All Statuses</option>
                                <option value="available">Available</option>
                                <option value="borrowed">Borrowed</option>
                                <option value="overdue">Overdue</option>
                                <option value="lost">Lost</option>
                                <option value="damaged">Damaged</option>
                            </select>

                            {/* Type Filter */}
                            <select
                                value={typeFilter}
                                onChange={(e) => handleFilterChange(statusFilter, e.target.value)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="">All Types</option>
                                {keyTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>

                            <Button type="submit" variant="secondary" size="sm" className="text-xs">
                                Apply
                            </Button>

                            {(search || statusFilter || typeFilter) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('');
                                        setTypeFilter('');
                                        router.get('/keys');
                                    }}
                                    className="text-xs text-slate-400 hover:text-slate-600"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Keys Inventory Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">Key ID / Code</th>
                                    <th className="py-3 px-4 font-semibold">Key Name & Location</th>
                                    <th className="py-3 px-4 font-semibold">Key Type</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold">Current Possession</th>
                                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {keys.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                                            No keys match the selected search and filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    keys.data.map((keyItem) => (
                                        <tr
                                            key={keyItem.id}
                                            className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                                        {keyItem.key_code}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400">
                                                    ID #{keyItem.id}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {keyItem.name}
                                                </div>
                                                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                                    <MapPin className="size-3 text-slate-400" />
                                                    <span>{keyItem.location}</span>
                                                </div>
                                                {keyItem.description && (
                                                    <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                                                        {keyItem.description}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                    {keyItem.key_type}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <StatusBadge status={keyItem.status} />
                                            </td>

                                            <td className="py-3.5 px-4">
                                                {keyItem.active_borrowing?.user ? (
                                                    <div>
                                                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {keyItem.active_borrowing.user.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            Due: {keyItem.active_borrowing.expected_return_at ? new Date(keyItem.active_borrowing.expected_return_at).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">
                                                        {keyItem.status === 'available' ? 'In Storage Rack' : 'N/A'}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* If available, anyone can borrow */}
                                                    {keyItem.status === 'available' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                setBorrowKeyId(keyItem.id);
                                                                setIsBorrowModalOpen(true);
                                                            }}
                                                            className="h-7 bg-blue-50 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
                                                        >
                                                            Borrow
                                                        </Button>
                                                    )}

                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                title="Edit Key"
                                                                onClick={() => {
                                                                    setSelectedKeyForEdit(keyItem);
                                                                    setIsKeyModalOpen(true);
                                                                }}
                                                                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </button>

                                                            <button
                                                                title="Mark as Damaged"
                                                                onClick={() => {
                                                                    setLostDamagedKey(keyItem);
                                                                    setLostDamagedMode('damaged');
                                                                }}
                                                                className="rounded-lg p-1 text-amber-500 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30"
                                                            >
                                                                <AlertTriangle className="size-3.5" />
                                                            </button>

                                                            <button
                                                                title="Mark as Lost"
                                                                onClick={() => {
                                                                    setLostDamagedKey(keyItem);
                                                                    setLostDamagedMode('lost');
                                                                }}
                                                                className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800"
                                                            >
                                                                <AlertOctagon className="size-3.5" />
                                                            </button>

                                                            <button
                                                                title="Delete Key"
                                                                onClick={() => handleDelete(keyItem)}
                                                                disabled={keyItem.status === 'borrowed' || keyItem.status === 'overdue'}
                                                                className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 dark:hover:bg-rose-950/30"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {keys.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-slate-500">
                                Showing {keys.from} to {keys.to} of {keys.total} keys
                            </span>
                            <div className="flex items-center gap-1">
                                {keys.links.map((link, idx) => (
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

            {/* Modals */}
            <KeyModal
                isOpen={isKeyModalOpen}
                onClose={() => setIsKeyModalOpen(false)}
                keyItem={selectedKeyForEdit}
            />

            <BorrowModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                availableKeys={availableKeysList}
                selectedKeyId={borrowKeyId}
            />

            <MarkLostDamagedModal
                isOpen={Boolean(lostDamagedKey)}
                onClose={() => setLostDamagedKey(null)}
                keyItem={lostDamagedKey}
                mode={lostDamagedMode}
            />
        </>
    );
}

KeysIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Keys Inventory', href: '/keys' },
    ],
};
