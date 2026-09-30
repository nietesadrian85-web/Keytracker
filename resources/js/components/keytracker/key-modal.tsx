import { useForm } from '@inertiajs/react';
import { KeyRound, X } from 'lucide-react';
import { useEffect } from 'react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { KeyItem } from '@/types/keytracker';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    keyItem?: KeyItem | null;
};

export function KeyModal({ isOpen, onClose, keyItem }: Props) {
    const isEditing = Boolean(keyItem);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        key_code: '',
        name: '',
        description: '',
        location: '',
        key_type: 'Room',
        status: 'available',
    });

    useEffect(() => {
        if (keyItem) {
            setData({
                key_code: keyItem.key_code,
                name: keyItem.name,
                description: keyItem.description || '',
                location: keyItem.location,
                key_type: keyItem.key_type,
                status: keyItem.status,
            });
        } else {
            reset();
        }
    }, [keyItem, isOpen]);

    if (!isOpen) return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing && keyItem) {
            put(`/keys/${keyItem.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/keys', {
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
                            <KeyRound className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isEditing ? 'Edit Key Details' : 'Add New Key'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {isEditing ? `Updating ${keyItem?.key_code}` : 'Register a new physical key into school inventory'}
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

                <form onSubmit={submit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="key_code" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Key Code / Tag ID
                            </Label>
                            <Input
                                id="key_code"
                                value={data.key_code}
                                onChange={(e) => setData('key_code', e.target.value)}
                                placeholder="e.g. KEY-SCI-101"
                                required
                                className="text-sm uppercase font-mono"
                            />
                            {errors.key_code && <p className="text-xs text-red-500">{errors.key_code}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="key_type" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Key Type
                            </Label>
                            <select
                                id="key_type"
                                value={data.key_type}
                                onChange={(e) => setData('key_type', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            >
                                <option value="Room">Room</option>
                                <option value="Master">Master</option>
                                <option value="Cabinet">Cabinet</option>
                                <option value="Padlock">Padlock</option>
                                <option value="Vehicle">Vehicle</option>
                            </select>
                            {errors.key_type && <p className="text-xs text-red-500">{errors.key_type}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Key Name / Door Description
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Science Lab 101 Main Door"
                            required
                            className="text-sm"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Room / Location
                        </Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="e.g. Science Wing, 1st Floor"
                            required
                            className="text-sm"
                        />
                        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="status" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Inventory Status
                        </Label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            required
                        >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="overdue">Overdue</option>
                            <option value="lost">Lost</option>
                            <option value="damaged">Damaged</option>
                        </select>
                        {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Additional Notes / Description (Optional)
                        </Label>
                        <textarea
                            id="description"
                            rows={2}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Special security notes, key duplicates count, cabinet numbers..."
                            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
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
                            {isEditing ? 'Save Changes' : 'Create Key'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

