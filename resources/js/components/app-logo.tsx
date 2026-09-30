import { KeyRound } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20">
                <KeyRound className="size-5" />
            </div>
            <div className="grid flex-1 text-left leading-none">
                <span className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    KeyTracker
                </span>
                <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    School Key System
                </span>
            </div>
        </div>
    );
}
