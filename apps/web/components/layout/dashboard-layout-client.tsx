'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { SidebarNav } from './sidebar-nav';
import { MobileHeader } from './mobile-header';

interface LayoutContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isMobile: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  isMobileOpen: false,
  setIsMobileOpen: () => {},
  isMobile: false,
});

export const useLayout = () => useContext(LayoutContext);

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isMobile }}>
      <div className="flex min-h-screen bg-background">
        {/* Mobile header */}
        <MobileHeader />

        {/* Sidebar */}
        <Sidebar>
          <SidebarNav />
        </Sidebar>

        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main
          className="flex-1 p-4 md:p-8 transition-[margin] duration-300 ease-in-out pt-16 md:pt-8"
          style={{ marginLeft: isMobile ? 0 : (isCollapsed ? '4rem' : '16rem') }}
        >
          {children}
        </main>
      </div>
    </LayoutContext.Provider>
  );
}
