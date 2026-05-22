"use client";

import { BarChart3, CircleAlert, JapaneseYen, ReceiptText } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { buildAnalysisStats } from "../../lib/analysisStats";
import type { ReactNode } from "react";
import { formatCurrency } from "../../lib/format";
import { loadCharges } from "../../lib/storage";
import type { ChargeRecord } from "../../lib/types";
import PageBackground from "../../components/PageBackground";

const selectableYears = Array.from({ length: 25 }, (_, index) => 2026 + index);
export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [charges, setCharges] = useState<ChargeRecord[]>([]);

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  useEffect(() => {
    setCharges(loadCharges());
  }, []);

  const analysisStats = useMemo(() => {
    return buildAnalysisStats(charges, selectedYear);
  }, [charges, selectedYear]);

  const yearData = analysisStats.monthlyItems;
  const selectedMonth = yearData[selectedMonthIndex] ?? yearData[0];
  const maxAmount = Math.max(...yearData.map((item) => item.totalAmount), 1);

  function handleYearChange(value: string) {
    setSelectedYear(Number(value));
    setSelectedMonthIndex(0);
  }

  return (
    <PageBackground className="px-2 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <BarChart3 size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">分析</h1>
        </div>

        <section className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-3 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  年間の月別課金額比較
                </p>
                <div className="mt-3 flex flex-wrap gap-5">
                  <div className="min-w-[260px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold text-slate-600">年間課金額</p>
                    <p className="mt-1 text-4xl font-bold text-slate-950">
                      {formatCurrency(analysisStats.yearlyTotalAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold text-slate-600">年間課金件数</p>
                    <p className="mt-1 text-4xl font-bold text-slate-950">
                      {analysisStats.yearlyChargeCount}件
                    </p>
                  </div>
                </div>
              </div>

              <select
                value={selectedYear}
                onChange={(event) => handleYearChange(event.target.value)}
                className="h-11 w-fit self-start rounded-2xl border border-slate-200 bg-white px-4 text-lg font-semibold text-slate-900 shadow-[0_12px_10px_-16px_rgba(15,23,42,0.55),0_0_0_1px_rgba(148,163,184,0.16)] outline-none transition focus:border-slate-400 focus:bg-white"
              >
                {selectableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-10 w-full max-w-full overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
              <div className="grid min-h-[300px] w-[520px] max-w-none grid-cols-12 items-end gap-2 sm:w-full sm:gap-3">
                {yearData.map((item, index) => {
                  const isSelected = selectedMonthIndex === index;
                  const hasAmount = item.totalAmount > 0;
                  const height = hasAmount
                    ? Math.max(22, (item.totalAmount / maxAmount) * 210)
                    : 12;

                  return (
                    <button
                      key={item.month}
                      type="button"
                      onClick={() => setSelectedMonthIndex(index)}
                      className="group flex min-w-0 flex-col items-center gap-2"
                      aria-pressed={isSelected}
                    >
                      <div className="relative flex h-[230px] w-full items-end justify-center">
                        {isSelected ? (
                          <div className="absolute bottom-[calc(100%+6px)] whitespace-nowrap rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.9)]">
                            {formatCurrency(item.totalAmount)}
                          </div>
                        ) : null}

                        <div
                          className={`w-full max-w-9 rounded-t-xl transition ${
                            isSelected
                              ? "bg-gradient-to-b from-blue-300 to-blue-600 ring-4 ring-blue-100"
                              : hasAmount
                                ? "bg-gradient-to-b from-blue-300 to-blue-500 group-hover:from-blue-400 group-hover:to-blue-600"
                                : "bg-slate-200 group-hover:bg-slate-300"
                          }`}
                          style={{ height: `${height}px` }}
                        />
                      </div>
                      <span
                        className={`whitespace-nowrap text-xs font-bold ${isSelected ? "text-slate-950" : "text-slate-500"}`}
                      >
                        {item.month}月
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                <CircleAlert size={16} strokeWidth={2.2} aria-hidden="true" />
                グラフのバーをクリックすると、その月の詳細が表示されます。
              </p>
            </div>
          </div>

          <aside className="border-t border-slate-200 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-7">
            <p className="text-sm font-semibold text-slate-500">選択中の月</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-950">
              {selectedMonth.month}月
            </h2>

            <div className="mt-7 grid gap-4">
              <DetailCard
                icon={
                  <ReceiptText size={22} strokeWidth={2.2} aria-hidden="true" />
                }
                label="課金件数"
                value={`${selectedMonth.chargeCount}件`}
              />
              <DetailCard
                icon={
                  <JapaneseYen size={22} strokeWidth={2.2} aria-hidden="true" />
                }
                label="合計課金額"
                value={formatCurrency(selectedMonth.totalAmount)}
              />
            </div>
          </aside>
        </section>
      </div>
    </PageBackground>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-[24px] bg-slate-50 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold text-slate-950">
          {value}
        </p>
      </div>
    </article>
  );
}
