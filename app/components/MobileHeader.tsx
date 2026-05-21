'use client';

import { Menu } from 'lucide-react';

type MobileHeaderProps = {
  onOpenMenu: () => void;
};

export default function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.6)] backdrop-blur md:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <img
          src="/kakin_checker_logo_mark_flat.svg"
          alt=""
          className="h-10 w-10 shrink-0"
          aria-hidden="true"
        />
        <p className="truncate text-base font-bold text-slate-950">課金チェッカー</p>
      </div>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
        aria-label="サイドパネルを開く"
        title="サイドパネルを開く"
        onClick={onOpenMenu}
      >
        <Menu size={23} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </header>
  );
}
