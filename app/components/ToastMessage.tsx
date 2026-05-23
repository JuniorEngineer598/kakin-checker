"use client";

import { CheckCircle2 } from "lucide-react";

type ToastMessageProps = {
  message: string;
};

export default function ToastMessage({ message }: ToastMessageProps) {
  if (!message) return null;

  return (
    <div className="fixed left-1/2 top-20 z-50 -translate-x-1/2 sm:left-auto sm:right-6 sm:top-5 sm:translate-x-0">
      <div
        role="status"
        aria-live="polite"
        className="flex animate-[toast-in_180ms_ease-out] items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-100 px-4 py-3 text-sm font-bold text-slate-800 shadow-[0_18px_45px_-24px_rgba(16,185,129,0.65)]"
      >
        <CheckCircle2 size={18} strokeWidth={2.4} aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}
