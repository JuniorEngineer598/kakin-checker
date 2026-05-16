'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { sidebarItems } from '../lib/navigation';

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white shadow-[14px_0_40px_-34px_rgba(15,23,42,0.5)] transition-[width,background-color] duration-200 ease-out ${
          isSidebarOpen ? 'w-60' : 'w-16 cursor-pointer hover:bg-slate-50'
        }`}
        onClick={() => {
          if (!isSidebarOpen) {
            setIsSidebarOpen(true);
          }
        }}
      >
        <div
          className={`flex h-16 items-center border-b border-slate-200 px-3 ${
            isSidebarOpen ? 'justify-between gap-3' : 'justify-center'
          }`}
        >
          <div
            className={`min-w-0 overflow-hidden transition-[width,opacity] ${
              isSidebarOpen ? 'w-full opacity-100' : 'pointer-events-none w-0 opacity-0'
            }`}
          >
            <p className="truncate text-sm font-bold text-slate-950">課金チェッカー</p>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 hover:shadow"
            aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
            aria-expanded={isSidebarOpen}
            onClick={(event) => {
              event.stopPropagation();
              setIsSidebarOpen((current) => !current);
            }}
          >
            {isSidebarOpen ? (
              <ArrowLeft size={20} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <span className="relative h-5 w-5" aria-hidden="true">
                <span className="absolute left-0 top-[3px] h-0.5 w-5 bg-current" />
                <span className="absolute left-0 top-[10px] h-0.5 w-5 bg-current" />
                <span className="absolute left-0 top-[17px] h-0.5 w-5 bg-current" />
              </span>
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-2.5 py-4" aria-label="メインメニュー">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex h-12 cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.85)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!isSidebarOpen) {
                    setIsSidebarOpen(true);
                  }
                }}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
                <span
                  className={`whitespace-nowrap transition ${
                    isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
