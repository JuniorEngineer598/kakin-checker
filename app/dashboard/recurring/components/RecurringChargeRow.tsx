import { CircleEllipsis, EllipsisVertical } from "lucide-react";
import AppIconView from "../../../components/AppIconView";
import {
  formatChargeDateLabel,
  formatCurrency,
  formatWeekdayLabel,
  parseChargeDate,
} from "../../../lib/format";
import { App, RecurringCharge } from "../../../lib/types";

function formatBillingDate(value: string) {
  const date = parseChargeDate(value);

  return `${formatChargeDateLabel(date)}（${formatWeekdayLabel(date)}）`;
}

function formatBillingCycleLabel(charge: RecurringCharge) {
  if (charge.billingCycle === "monthly") {
    return `毎月${charge.billingDay}日`;
  }

  return `${charge.intervalDays}日`;
}

type RecurringChargeRowProps = {
  charge: RecurringCharge;
  app: App | undefined;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
};

export default function RecurringChargeRow({
  charge,
  app,
  isMenuOpen,
  onToggleMenu,
  onPause,
  onResume,
  onDelete,
}: RecurringChargeRowProps) {
  const isActive = charge.status === "active";
  const statusLabel = isActive ? "有効" : "一時停止";
  const statusClassName = `inline-flex rounded-full px-3 py-1 text-xs font-bold ${
    isActive ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"
  }`;

  return (
    <article className="relative bg-white px-5 py-4 pr-14 lg:pr-5">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1.5fr)_6.5rem_14.8rem_3rem_3.5rem] lg:items-center lg:gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {app ? (
            <AppIconView
              icon={app.icon}
              className="h-12 w-12 shrink-0 rounded-full"
              iconClassName="h-6 w-6"
            />
          ) : (
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
          )}

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-base font-black text-slate-950">
                {app?.name ?? "不明なアプリ"}
              </p>
              <span className="shrink-0 text-sm font-bold text-slate-300">
                /
              </span>
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-base font-black text-slate-950">
                  {charge.itemName}
                </p>
                <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                  {charge.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 lg:hidden">金額</p>
          <p className="text-lg font-bold text-slate-950">
            {formatCurrency(charge.amount)}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(4.25rem,0.8fr)_minmax(4.5rem,0.8fr)] items-start gap-4 lg:grid-cols-[10rem_5rem] lg:items-center lg:gap-1">
          <div className="flex flex-col items-center text-center lg:block lg:text-left">
            <p className="text-xs font-bold text-slate-400 lg:hidden">
              次回の課金日
            </p>
            <p className="text-sm font-bold text-slate-700 lg:whitespace-nowrap">
              {formatBillingDate(charge.nextBillingDate)}
            </p>
          </div>

          <div className="flex flex-col items-center text-center lg:block lg:text-left">
            <p className="text-xs font-bold text-slate-400 lg:hidden">周期</p>
            <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 lg:-translate-x-3">
              {formatBillingCycleLabel(charge)}
            </span>
          </div>

          <div className="flex flex-col items-center text-center lg:hidden">
            <p className="text-xs font-bold text-slate-400">ステータス</p>
            <span className={statusClassName}>{statusLabel}</span>
          </div>
        </div>

        <div className="hidden lg:block lg:text-center">
          <span className={statusClassName}>{statusLabel}</span>
        </div>

        <div className="absolute right-4 top-4 flex justify-end lg:relative lg:right-auto lg:top-auto">
          <button
            type="button"
            aria-label={`${charge.itemName}の操作メニュー`}
            aria-expanded={isMenuOpen}
            onClick={onToggleMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <CircleEllipsis
              size={23}
              strokeWidth={2.1}
              aria-hidden="true"
              className="lg:hidden"
            />
            <EllipsisVertical
              size={20}
              strokeWidth={2.2}
              aria-hidden="true"
              className="hidden lg:block"
            />
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-10 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
              <button
                type="button"
                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                編集
              </button>
              <button
                type="button"
                onClick={isActive ? onPause : onResume}
                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {isActive ? "一時停止" : "再開"}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
              >
                削除
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
