import { useForm } from '@inertiajs/react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { BorrowingItem } from '@/types/keytracker';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    borrowing: BorrowingItem | null;
};

export function ReportIssueModal({ isOpen, onClose, borrowing }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        issue_type: 'damaged' as 'lost' | 'damaged',
        notes: '',
    });

    if (!isOpen || !borrowing) return null;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/borrowing/${borrowing.id}/report-issue`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Report Key Issue
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Notify administration of damaged or misplaced key
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

                <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {borrowing.key?.name} ({borrowing.key?.key_code})
                    </span>
                    <div className="text-[11px] text-slate-500">{borrowing.key?.location}</div>
                </div>

                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Issue Type
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setData('issue_type', 'damaged')}
                                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                                    data.issue_type === 'damaged'
                                        ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-500 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                                }`}
                            >
                                <AlertTriangle className="size-4 text-amber-600" />
                                <span>Key is Damaged</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('issue_type', 'lost')}
                                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                                    data.issue_type === 'lost'
                                        ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-500 dark:bg-rose-950/40 dark:text-rose-300'
                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
                                }`}
                            >
                                <AlertCircle className="size-4 text-rose-600" />
                                <span>Key is Lost</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Explanation / Situation Details
                        </Label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Please explain what happened to the key..."
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
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
                            className="bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm"
                        >
                            {processing && <Spinner className="mr-1.5 size-3.5" />}
                            Submit Report
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

