import { CalendarDays, ClipboardList, } from "lucide-react";
import { formatCurrency } from "../../../lib/format";

type RecurringSummaryProps = {
    activeCount: number;
    totalScheduledAmount: number;
};

export default function RecurringSummary({ activeCount, totalScheduledAmount }: RecurringSummaryProps) {
    return (
        <section className="grid grid-cols-[minmax(0,1.9fr)_minmax(6.75rem,0.85fr)] gap-3 lg:grid-cols-2 lg:gap-4">
        <article className="flex min-w-0 items-center gap-3 rounded-[24px] bg-white px-4 py-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:gap-5 sm:rounded-[28px] sm:px-6 sm:py-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
            <CalendarDays
              size={26}
              strokeWidth={2.2}
              aria-hidden="true"
              className="sm:h-[30px] sm:w-[30px]"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
              登録中の定期課金予定
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 sm:mt-2 sm:text-4xl">
              {formatCurrency(totalScheduledAmount)}
            </p>
          </div>
        </article>

        <article className="flex min-w-0 items-center justify-center gap-2 rounded-[24px] bg-white px-2 py-4 text-left shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:justify-start sm:gap-5 sm:rounded-[28px] sm:px-6 sm:py-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:h-16 sm:w-16">
            <ClipboardList
              size={23}
              strokeWidth={2.2}
              aria-hidden="true"
              className="sm:h-[30px] sm:w-[30px]"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500 sm:text-sm">
              登録中
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-950 sm:mt-2 sm:text-4xl">
              {activeCount}件
            </p>
          </div>
        </article>
      </section>
    );
}