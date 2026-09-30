import { useForm } from '@inertiajs/react';
import { AlertOctagon, AlertTriangle, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { KeyItem } from '@/types/keytracker';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    keyItem: KeyItem | null;
    mode: 'lost' | 'damaged';
};

export function MarkLostDamagedModal({ isOpen, onClose, keyItem, mode }: Props) {
    const todayStr = new Date().toISOString().slice(0, 10);

    const { data, setData, post, processing, errors, reset } = useForm({
        date_reported: todayStr,
        reported_by: '',
        notes: '',
    });

    if (!isOpen || !keyItem) return null;

    const isLost = mode === 'lost';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = isLost ? `/keys/${keyItem.id}/lost` : `/keys/${keyItem.id}/damaged`;
        post(url, {
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
                        <div
                            className={`flex size-9 items-center justify-center rounded-lg ${
                                isLost
                                    ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}
                        >
                            {isLost ? <AlertOctagon className="size-5" /> : <AlertTriangle className="size-5" />}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {isLost ? 'Mark Key as Lost' : 'Mark Key as Damaged'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Update key inventory status
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
                        {keyItem.name} ({keyItem.key_code})
                    </span>
                    <div className="text-[11px] text-slate-500">{keyItem.location}</div>
                </div>

                <form onSubmit={submit} className="mt-4 space-y-3.5">
                    {isLost && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="date_reported" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Date Reported Lost
                                </Label>
                                <Input
                                    id="date_reported"
                                    type="date"
                                    value={data.date_reported}
                                    onChange={(e) => setData('date_reported', e.target.value)}
                                    required
                                    className="text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="reported_by" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Reported By (Person / Staff)
                                </Label>
                                <Input
                                    id="reported_by"
                                    value={data.reported_by}
                                    onChange={(e) => setData('reported_by', e.target.value)}
                                    placeholder="e.g., Security Guard John, Prof. Smith"
                                    className="text-sm"
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="notes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Incident Notes & Details
                        </Label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder={isLost ? 'Describe where it was misplaced or last seen...' : 'Describe the damage to the key teeth, shaft, or ring...'}
                            required
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
                            className={`text-xs font-semibold text-white shadow-sm ${
                                isLost ? 'bg-zinc-700 hover:bg-zinc-800' : 'bg-amber-600 hover:bg-amber-700'
                            }`}
                        >
                            {processing && <Spinner className="mr-1.5 size-3.5" />}
                            {isLost ? 'Confirm Key as Lost' : 'Confirm Key as Damaged'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

