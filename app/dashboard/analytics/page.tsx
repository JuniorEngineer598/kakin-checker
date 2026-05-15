'use client';

import { CircleAlert, JapaneseYen, ReceiptText } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type MonthAnalytics = {
  month: string;
  amount: number;
  count: number;
};

const analyticsData: Record<number, MonthAnalytics[]> = {
  2026: [
    { month: '1月', amount: 6200, count: 2 },
    { month: '2月', amount: 9300, count: 3 },
    { month: '3月', amount: 4800, count: 1 },
    { month: '4月', amount: 11600, count: 4 },
    { month: '5月', amount: 38400, count: 9 },
    { month: '6月', amount: 17200, count: 5 },
    { month: '7月', amount: 0, count: 0 },
    { month: '8月', amount: 0, count: 0 },
    { month: '9月', amount: 0, count: 0 },
    { month: '10月', amount: 0, count: 0 },
    { month: '11月', amount: 0, count: 0 },
    { month: '12月', amount: 0, count: 0 },
  ],
};

const selectableYears = Array.from({ length: 25 }, (_, index) => 2026 + index);
const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

function createEmptyYearData(): MonthAnalytics[] {
  return monthLabels.map((month) => ({ month, amount: 0, count: 0 }));
}

function getInitialMonthIndex(data: MonthAnalytics[]) {
  for (let index = data.length - 1; index >= 0; index -= 1) {
    if (data[index].amount > 0 || data[index].count > 0) {
      return index;
    }
  }

  return 4;
}

export default function AnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const yearData = useMemo(() => analyticsData[selectedYear] ?? createEmptyYearData(), [selectedYear]);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => getInitialMonthIndex(analyticsData[2026]));

  const selectedMonth = yearData[selectedMonthIndex] ?? yearData[4];
  const annualTotal = yearData.reduce((sum, item) => sum + item.amount, 0);
  const maxAmount = Math.max(...yearData.map((item) => item.amount), 1);

  function handleYearChange(value: string) {
    const nextYear = Number(value);
    const nextData = analyticsData[nextYear] ?? createEmptyYearData();

    setSelectedYear(nextYear);
    setSelectedMonthIndex(getInitialMonthIndex(nextData));
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500">Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">分析</h1>
        </div>

        <section className="grid overflow-hidden rounded-[28px] bg-white shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">年間の月別課金額比較</p>
                <p className="mt-2 text-4xl font-bold text-slate-950">{formatCurrency(annualTotal)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-400">{selectedYear}年の合計</p>
              </div>

              <select
                value={selectedYear}
                onChange={(event) => handleYearChange(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-600 outline-none transition focus:border-slate-400 focus:bg-white"
              >
                {selectableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-10 grid min-h-[300px] grid-cols-12 items-end gap-2 sm:gap-3">
              {yearData.map((item, index) => {
                const isSelected = selectedMonthIndex === index;
                const hasAmount = item.amount > 0;
                const height = hasAmount ? Math.max(22, (item.amount / maxAmount) * 210) : 12;

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
                          {formatCurrency(item.amount)}
                        </div>
                      ) : null}

                      <div
                        className={`w-full max-w-9 rounded-t-xl transition ${
                          isSelected
                            ? 'bg-slate-950 ring-4 ring-slate-200'
                            : hasAmount
                              ? 'bg-slate-800 group-hover:bg-slate-950'
                              : 'bg-slate-200 group-hover:bg-slate-300'
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-slate-500'}`}>
                      {item.month}
                    </span>
                  </button>
                );
              })}
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
            <h2 className="mt-2 text-4xl font-bold text-slate-950">{selectedMonth.month}</h2>

            <div className="mt-7 grid gap-4">
              <DetailCard
                icon={<ReceiptText size={22} strokeWidth={2.2} aria-hidden="true" />}
                label="課金件数"
                value={`${selectedMonth.count}件`}
              />
              <DetailCard
                icon={<JapaneseYen size={22} strokeWidth={2.2} aria-hidden="true" />}
                label="合計課金額"
                value={formatCurrency(selectedMonth.amount)}
              />
            </div>
          </aside>
        </section>
      </div>
    </main>
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
        <p className="mt-1 truncate text-2xl font-bold text-slate-950">{value}</p>
      </div>
    </article>
  );
}
