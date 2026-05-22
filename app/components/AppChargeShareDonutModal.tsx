"use client";

import { CircleAlert, X } from "lucide-react";
import type { AppChargeShareItem } from "../lib/analysisStats";
import AppChargeShareDonutChart from "./AppChargeShareDonutChart";

type AppChargeShareDonutModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  items: AppChargeShareItem[];
  onClose: () => void;
};

export default function AppChargeShareDonutModal({
  isOpen,
  title,
  description,
  items,
  onClose,
}: AppChargeShareDonutModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/40 px-4 pb-4 pt-20 backdrop-blur-sm sm:items-center sm:py-6">
      <section
        className="max-h-[calc(100dvh-96px)] w-full max-w-xl overflow-y-auto rounded-[24px] bg-white p-4 shadow-[0_28px_90px_-35px_rgba(15,23,42,0.7)] sm:max-h-[calc(100dvh-48px)] sm:rounded-[28px] sm:p-6 md:min-h-[420px] md:max-w-3xl md:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-charge-share-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="app-charge-share-title"
              className="text-xl font-bold text-slate-950"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5">
          <AppChargeShareDonutChart items={items} size="large" />
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400 sm:hidden">
          <CircleAlert size={15} strokeWidth={2.2} aria-hidden="true" />
          一覧は縦にスクロールできます。
        </p>
      </section>
    </div>
  );
}
