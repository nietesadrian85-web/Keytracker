import { Link, usePage } from '@inertiajs/react';
import { Bell, KeyRound, Shield, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import type { Auth, SharedCounts } from '@/types/auth';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();
    const auth = (page.props as unknown as { auth?: Auth })?.auth;
    const counts = (page.props as unknown as { counts?: SharedCounts })?.counts;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const alertsCount = (counts?.overdue_keys ?? 0) + (isAdmin ? (counts?.pending_requests ?? 0) : 0);

    return (
        <header className="border-sidebar-border/50 bg-white/80 backdrop-blur-xs flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6 dark:bg-slate-900/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-3">
                {user && (
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider ${
                                isAdmin
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                        >
                            <Shield className="size-3" />
                            {user.role}
                        </span>

                        {user.department && (
                            <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[150px]">
                                {user.department}
                            </span>
                        )}
                    </div>
                )}

                <Link
                    href="/notifications"
                    className="relative flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    title="Alerts and Notifications"
                >
                    <Bell className="size-4" />
                    {alertsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                            {alertsCount > 9 ? '9+' : alertsCount}
                        </span>
                    )}
                </Link>

                <Link
                    href="/keys"
                    className="hidden md:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                >
                    <KeyRound className="size-3.5" />
                    <span>Keys</span>
                </Link>
            </div>
        </header>
    );
}
