import { useForm } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, RotateCcw, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { BorrowingItem } from '@/types/keytracker';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    borrowing: BorrowingItem | null;
};

export function ReturnModal({ isOpen, onClose, borrowing }: Props) {
    const nowStr = new Date().toISOString().slice(0, 16);

    const { data, setData, post, processing, errors, reset } = useForm({
        returned_at: nowStr,
        return_condition: 'good' as 'good' | 'damaged' | 'missing',
        notes: '',
    });

    if (!isOpen || !borrowing) return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/borrowing/${borrowing.id}/return`, {
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
                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                            <RotateCcw className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Record Key Return
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Verify physical key condition upon return
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

                <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                    <div className="font-semibold text-slate-900 dark:text-white">
                        {borrowing.key?.name} ({borrowing.key?.key_code})
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                        Borrower: <span className="font-medium text-slate-700 dark:text-slate-300">{borrowing.user?.name}</span> ({borrowing.user?.department || 'Staff'})
                    </div>
                    <div className="text-[11px] text-slate-500">
                        Purpose: <span className="italic">{borrowing.purpose}</span>
                    </div>
                </div>

                <form onSubmit={submit} className="mt-5 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="returned_at" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Actual Return Date & Time
                        </Label>
                        <Input
                            id="returned_at"
                            type="datetime-local"
                            value={data.returned_at}
                            onChange={(e) => setData('returned_at', e.target.value)}
                            required
                            className="text-sm"
                        />
                        {errors.returned_at && <p className="text-xs text-red-500">{errors.returned_at}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Key Condition
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setData('return_condition', 'good')}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                                    data.return_condition === 'good'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                                <span>Good Condition</span>
                                <span className="text-[10px] font-normal opacity-80">Becomes Available</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('return_condition', 'damaged')}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                                    data.return_condition === 'damaged'
                                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                                <span>Damaged</span>
                                <span className="text-[10px] font-normal opacity-80">Becomes Damaged</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('return_condition', 'missing')}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                                    data.return_condition === 'missing'
                                        ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500 dark:bg-rose-950/40 dark:text-rose-300'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                            >
                                <X className="size-5 text-rose-600 dark:text-rose-400" />
                                <span>Missing / Lost</span>
                                <span className="text-[10px] font-normal opacity-80">Becomes Lost</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Return Notes / Condition Comments
                        </Label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Optional notes regarding key integrity, scratches, tags, or handover..."
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
                            className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                        >
                            {processing && <Spinner className="mr-1.5 size-3.5" />}
                            Complete Return
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

