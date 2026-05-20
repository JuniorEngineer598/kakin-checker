'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ReactNode } from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileDrawer from './MobileDrawer';
import MobileHeader from './MobileHeader';

export default function AppShell({ children }: { children: ReactNode }) {
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <DesktopSidebar
        isOpen={isDesktopSidebarOpen}
        pathname={pathname}
        onOpenChange={setIsDesktopSidebarOpen}
      />

      <MobileHeader onOpenMenu={() => setIsMobileDrawerOpen(true)} />
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        pathname={pathname}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      <div className="min-w-0 flex-1 pt-16 md:pt-0">{children}</div>
    </div>
  );
}
