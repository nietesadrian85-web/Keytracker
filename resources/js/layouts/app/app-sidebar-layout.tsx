import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const page = usePage();
    const flash = (page.props as unknown as { flash?: { success?: string | null; error?: string | null } })?.flash;

    const [visibleFlash, setVisibleFlash] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setVisibleFlash({ type: 'success', message: flash.success });
            const t = setTimeout(() => setVisibleFlash(null), 6000);
            return () => clearTimeout(t);
        } else if (flash?.error) {
            setVisibleFlash({ type: 'error', message: flash.error });
            const t = setTimeout(() => setVisibleFlash(null), 8000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip bg-slate-50/60 dark:bg-slate-950">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {visibleFlash && (
                    <div className="mx-6 mt-4 md:mx-8">
                        <div
                            className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm font-medium shadow-sm transition-all ${
                                visibleFlash.type === 'success'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
                                    : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {visibleFlash.type === 'success' ? (
                                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <AlertCircle className="size-5 shrink-0 text-red-600 dark:text-red-400" />
                                )}
                                <span>{visibleFlash.message}</span>
                            </div>
                            <button
                                onClick={() => setVisibleFlash(null)}
                                className="text-xs opacity-70 hover:opacity-100"
                            >
                                ✕ Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {children}
            </AppContent>
        </AppShell>
    );
}
