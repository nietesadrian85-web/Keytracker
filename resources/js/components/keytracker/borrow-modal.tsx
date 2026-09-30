import { useForm } from '@inertiajs/react';
import { Calendar, Clock, FileText, KeyRound, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { KeyItem } from '@/types/keytracker';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    availableKeys: KeyItem[];
    selectedKeyId?: number | null;
};

export function BorrowModal({ isOpen, onClose, availableKeys, selectedKeyId }: Props) {
    // Default expected return date to tomorrow at 17:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 0, 0, 0);
    const defaultDateStr = tomorrow.toISOString().slice(0, 16);

    const { data, setData, post, processing, errors, reset } = useForm({
        key_id: selectedKeyId ? String(selectedKeyId) : availableKeys[0]?.id ? String(availableKeys[0].id) : '',
        purpose: '',
        expected_return_at: defaultDateStr,
    });

    if (!isOpen) return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/borrowing/request', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
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
                                Request Physical Key
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Submit a borrowing request to Campus Administration
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
                    <div className="space-y-1.5">
                        <Label htmlFor="key_id" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Available Key to Borrow
                        </Label>
                        {availableKeys.length > 0 ? (
                            <select
                                id="key_id"
                                value={data.key_id}
                                onChange={(e) => setData('key_id', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            >
                                <option value="">-- Select a Key --</option>
                                {availableKeys.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.name} ({k.key_code}) – {k.location}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                                No keys are currently marked as available in inventory.
                            </div>
                        )}
                        {errors.key_id && <p className="text-xs text-red-500">{errors.key_id}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="expected_return_at" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Clock className="size-3.5 text-slate-500" />
                            <span>Expected Return Date & Time</span>
                        </Label>
                        <Input
                            id="expected_return_at"
                            type="datetime-local"
                            value={data.expected_return_at}
                            onChange={(e) => setData('expected_return_at', e.target.value)}
                            required
                            className="text-sm"
                        />
                        {errors.expected_return_at && (
                            <p className="text-xs text-red-500">{errors.expected_return_at}</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                            Keys returned after this time will automatically be flagged as Overdue.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="purpose" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <FileText className="size-3.5 text-slate-500" />
                            <span>Purpose of Borrowing</span>
                        </Label>
                        <textarea
                            id="purpose"
                            rows={3}
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                            placeholder="e.g., Grade 10 Science lab class setup, Robotics practice, Theater rehearsal..."
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        {errors.purpose && <p className="text-xs text-red-500">{errors.purpose}</p>}
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
                            disabled={processing || availableKeys.length === 0}
                            className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                        >
                            {processing && <Spinner className="mr-1.5 size-3.5" />}
                            Submit Borrow Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

