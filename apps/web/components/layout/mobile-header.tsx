'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useLayout } from './dashboard-layout-client';

export function MobileHeader() {
  const { setIsMobileOpen } = useLayout();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 md:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          CodeCrew Portal
        </span>
      </Link>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="p-2 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  );
}
