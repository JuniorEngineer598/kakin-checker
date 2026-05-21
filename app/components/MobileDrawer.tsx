'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { sidebarItems } from '../lib/navigation';

type MobileDrawerProps = {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
};

export default function MobileDrawer({ isOpen, pathname, onClose }: MobileDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
        aria-label="サイドパネルを閉じる"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] flex-col border-r border-slate-200 bg-white shadow-[22px_0_60px_-34px_rgba(15,23,42,0.75)]">
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src="/kakin_checker_logo_mark.svg"
              alt=""
              className="h-10 w-10 shrink-0"
              aria-hidden="true"
            />
            <p className="truncate text-base font-bold text-slate-950">課金チェッカー</p>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            aria-label="サイドパネルを閉じる"
            title="サイドパネルを閉じる"
            onClick={onClose}
          >
            <X size={21} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-4" aria-label="メインメニュー">
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
                className={`group flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.85)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
                aria-current={isActive ? 'page' : undefined}
                onClick={onClose}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
