import { Head, router, usePage } from '@inertiajs/react';
import {
    Building2,
    Mail,
    Pencil,
    Phone,
    Plus,
    Power,
    Search,
    Shield,
    Trash2,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/keytracker/status-badge';
import { UserModal } from '@/components/keytracker/user-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Auth, User } from '@/types/auth';
import type { PaginatedData } from '@/types/keytracker';

type Props = {
    users: PaginatedData<User>;
    filters: {
        search: string;
        role: string;
        status: string;
    };
    departments: string[];
};

export default function UsersIndex({ users, filters, departments }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState(filters.search);
    const [roleFilter, setRoleFilter] = useState(filters.role);
    const [statusFilter, setStatusFilter] = useState(filters.status);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/users',
            {
                search,
                role: roleFilter,
                status: statusFilter,
            },
            { preserveState: true }
        );
    };

    const handleToggleStatus = (user: User) => {
        const action = user.status === 'active' ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} account for ${user.name}?`)) {
            router.post(`/users/${user.id}/toggle-status`, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete user account '${user.name}' (${user.email})?`)) {
            router.delete(`/users/${user.id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="User Management - KeyTracker" />

            <div className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight dark:text-white sm:text-3xl">
                                User Management
                            </h1>
                            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                {users.total} Accounts
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Manage staff and administrator permissions, campus departments, and access credentials.
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            setSelectedUserForEdit(null);
                            setIsUserModalOpen(true);
                        }}
                        className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                        <Plus className="mr-1.5 size-3.5" />
                        Add New User
                    </Button>
                </div>

                {/* Search & Role Filters */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by name, email, department, or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-xs"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    router.get('/users', { search, role: e.target.value, status: statusFilter });
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Administrator</option>
                                <option value="staff">Staff</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    router.get('/users', { search, role: roleFilter, status: e.target.value });
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <Button type="submit" variant="secondary" size="sm" className="text-xs">
                                Filter
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Users Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">User & Contact</th>
                                    <th className="py-3 px-4 font-semibold">Department</th>
                                    <th className="py-3 px-4 font-semibold">Role</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold">Active Keys</th>
                                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                                            No user accounts match your search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs dark:bg-blue-900/50 dark:text-blue-300">
                                                        {u.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 dark:text-white">
                                                            {u.name}
                                                            {u.id === currentUser.id && (
                                                                <span className="ml-1.5 rounded-sm bg-blue-100 px-1 py-0.2 text-[9px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                                    YOU
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                            <Mail className="size-3 text-slate-400" />
                                                            <span>{u.email}</span>
                                                        </div>
                                                        {u.contact_number && (
                                                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                                <Phone className="size-3" />
                                                                <span>{u.contact_number}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                                                {u.department ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        <Building2 className="size-3 text-slate-400" />
                                                        {u.department}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                                        u.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}
                                                >
                                                    <Shield className="size-3" />
                                                    {u.role}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <StatusBadge status={u.status} />
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {u.active_borrowings_count || 0}
                                                </span>
                                                <span className="text-slate-400 text-[11px] ml-1">
                                                    ({u.total_borrowings_count || 0} total)
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        title="Edit User"
                                                        onClick={() => {
                                                            setSelectedUserForEdit(u);
                                                            setIsUserModalOpen(true);
                                                        }}
                                                        className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>

                                                    {u.id !== currentUser.id && (
                                                        <>
                                                            <button
                                                                title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
                                                                onClick={() => handleToggleStatus(u)}
                                                                className={`rounded-lg p-1 ${
                                                                    u.status === 'active'
                                                                        ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-700'
                                                                        : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700'
                                                                }`}
                                                            >
                                                                <Power className="size-3.5" />
                                                            </button>

                                                            <button
                                                                title="Delete User"
                                                                onClick={() => handleDelete(u)}
                                                                disabled={Boolean(u.active_borrowings_count && u.active_borrowings_count > 0)}
                                                                className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
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
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-slate-500">
                                Showing {users.from} to {users.to} of {users.total} users
                            </span>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, idx) => (
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

            {/* User Modal */}
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                userItem={selectedUserForEdit}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User Management', href: '/users' },
    ],
};

