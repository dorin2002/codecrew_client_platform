'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useLayout } from './dashboard-layout-client';

export const useSidebar = () => {
  const { isCollapsed, isMobile } = useLayout();
  return { isCollapsed: isMobile ? false : isCollapsed };
};

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isMobile } = useLayout();

  return (
    <aside
        data-slot="sidebar"
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto',
          // Desktop styles
          'hidden md:block',
          isCollapsed ? 'md:w-16' : 'md:w-64',
          // Mobile styles - slide in from left
          isMobileOpen && 'block w-64 shadow-2xl',
          className
        )}
      >
        {/* Header with logo and collapse button */}
        <div
          data-slot="sidebar-header"
          className={cn(
            "flex h-16 items-center border-b border-sidebar-border transition-all duration-300 ease-in-out",
            isCollapsed && !isMobile ? "justify-center px-0" : "justify-between px-3"
          )}
        >
          <Link
            href="/dashboard"
            onClick={() => isMobile && setIsMobileOpen(false)}
            className={cn(
              "flex items-center transition-all duration-300 ease-in-out",
              isCollapsed && !isMobile ? "justify-center" : "gap-2"
            )}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span
              className={cn(
                "text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100"
              )}
            >
              CodeCrew Portal
            </span>
          </Link>
          {/* Close button on mobile */}
          {isMobile ? (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "p-2 rounded-md hover:bg-sidebar-accent transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed ? "w-0 opacity-0 p-0" : "opacity-100"
              )}
              aria-label="Collapse sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation content */}
        <div data-slot="sidebar-content" className="flex-1 overflow-y-auto py-4">
          {children}
        </div>

        {/* Expand button when collapsed - desktop only */}
        {!isMobile && (
          <div
            className={cn(
              "p-3 flex justify-center transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-100" : "opacity-0 h-0 p-0 overflow-hidden"
            )}
          >
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-sidebar-accent transition-colors"
              aria-label="Expand sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* User section at bottom */}
        <div
          data-slot="sidebar-footer"
          className="border-t border-sidebar-border p-3 transition-all duration-300 ease-in-out"
        >
          <div
            className={cn(
              "flex items-center transition-all duration-300 ease-in-out",
              isCollapsed && !isMobile ? "justify-center" : "gap-3"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">AD</span>
            </div>
            <div
              className={cn(
                "min-w-0 transition-all duration-300 ease-in-out overflow-hidden",
                isCollapsed && !isMobile ? "w-0 opacity-0" : "flex-1 opacity-100"
              )}
            >
              <p className="text-sm font-medium truncate whitespace-nowrap">Admin User</p>
              <p className="text-xs text-muted-foreground truncate whitespace-nowrap">
                admin@codecrew.com
              </p>
            </div>
          </div>
        </div>
      </aside>
  );
}
