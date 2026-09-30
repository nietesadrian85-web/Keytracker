import { useForm } from '@inertiajs/react';
import { UserCheck, UserPlus, X } from 'lucide-react';
import { useEffect } from 'react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/auth';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    userItem?: User | null;
};

export function UserModal({ isOpen, onClose, userItem }: Props) {
    const isEditing = Boolean(userItem);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staff' as 'admin' | 'staff',
        department: '',
        contact_number: '',
        status: 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
        if (userItem) {
            setData({
                name: userItem.name,
                email: userItem.email,
                password: '',
                role: userItem.role,
                department: userItem.department || '',
                contact_number: userItem.contact_number || '',
                status: userItem.status,
            });
        } else {
            reset();
        }
    }, [userItem, isOpen]);

    if (!isOpen) return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing && userItem) {
            put(`/users/${userItem.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/users', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                            {isEditing ? <UserCheck className="size-5" /> : <UserPlus className="size-5" />}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isEditing ? 'Edit User Account' : 'Add New User'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isEditing ? `Managing ${userItem?.name}` : 'Create a new staff or admin user account'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="mt-5 space-y-3.5">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Dr. Arthur Vance, Prof. Jane Smith"
                            required
                            className="text-sm"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Institutional Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@school.edu"
                                required
                                className="text-sm"
                            />
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                {isEditing ? 'Password (leave blank to keep)' : 'Password'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required={!isEditing}
                                className="text-sm"
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="role" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Role Assignment
                            </Label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as 'admin' | 'staff')}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            >
                                <option value="staff">Staff (Teacher, Coach, Faculty)</option>
                                <option value="admin">Administrator (Security & Facilities)</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Account Status
                            </Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive / Deactivated</option>
                            </select>
                            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="department" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Department
                            </Label>
                            <Input
                                id="department"
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                                placeholder="e.g. Science Department"
                                className="text-sm"
                            />
                            {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="contact_number" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Contact Number
                            </Label>
                            <Input
                                id="contact_number"
                                value={data.contact_number}
                                onChange={(e) => setData('contact_number', e.target.value)}
                                placeholder="e.g. +1 (555) 019-2831"
                                className="text-sm"
                            />
                            {errors.contact_number && <p className="text-xs text-red-500">{errors.contact_number}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="text-xs font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                            {processing && <Spinner className="mr-1.5 size-3.5" />}
                            {isEditing ? 'Save Changes' : 'Create Account'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

