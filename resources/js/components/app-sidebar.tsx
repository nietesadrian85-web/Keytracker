import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckSquare,
    ClipboardList,
    History,
    Key,
    LayoutDashboard,
    PieChart,
    Settings,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import type { Auth, SharedCounts } from '@/types/auth';

export function AppSidebar() {
    const page = usePage();
    const auth = (page.props as unknown as { auth?: Auth })?.auth;
    const counts = (page.props as unknown as { counts?: SharedCounts })?.counts;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Keys Inventory',
            href: '/keys',
            icon: Key,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'Borrow Requests',
                      href: '/borrowing/requests',
                      icon: CheckSquare,
                      badge: counts?.pending_requests ?? 0,
                      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
                  },
              ]
            : []),
        {
            title: 'My Borrowed Keys',
            href: '/borrowing/my-keys',
            icon: ClipboardList,
            badge: counts?.my_borrowed ?? 0,
            badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
        },
        {
            title: 'Transactions',
            href: '/transactions',
            icon: History,
        },
        ...(isAdmin
            ? [
                  {
                      title: 'User Management',
                      href: '/users',
                      icon: Users,
                  },
                  {
                      title: 'Reports & Analytics',
                      href: '/reports',
                      icon: PieChart,
                  },
              ]
            : []),
        {
            title: 'Notifications',
            href: '/notifications',
            icon: Bell,
            badge: (counts?.overdue_keys ?? 0) > 0 ? counts?.overdue_keys : undefined,
            badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
        },
        {
            title: 'Settings',
            href: '/settings/profile',
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-2 px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Account ({user?.role?.toUpperCase() || 'USER'})
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
