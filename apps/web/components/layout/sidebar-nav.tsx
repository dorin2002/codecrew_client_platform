'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar';
import { useLayout } from './dashboard-layout-client';
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Organizations',
    href: '/organizations',
    icon: Building2,
  },
  {
    label: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const { isMobile, setIsMobileOpen } = useLayout();

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <nav data-slot="sidebar-nav" className={cn('space-y-1 px-3', className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={cn(
              'flex items-center rounded-md text-sm font-medium transition-all duration-300 ease-in-out',
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
