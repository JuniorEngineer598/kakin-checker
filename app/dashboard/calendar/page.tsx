'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

type ChargeDay = {
  amount: number;
  count: number;
  items: {
    name: string;
    amount: number;
  }[];
};

const days = Array.from({ length: 35 }, (_, index) => index + 1);
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
const chargeByDay: Record<number, ChargeDay> = {
  3: { amount: 980, count: 1, items: [{ name: '祝福パック', amount: 980 }] },
  8: { amount: 1220, count: 1, items: [{ name: '紀行', amount: 1220 }] },
  14: { amount: 6100, count: 1, items: [{ name: '創世結晶', amount: 6100 }] },
  21: { amount: 9800, count: 1, items: [{ name: '限定パック', amount: 9800 }] },
  28: { amount: 29300, count: 1, items: [{ name: '大型パック', amount: 29300 }] },
};
const monthlyTotal = 47400;
const monthlyChargeCount = 5;

function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState(3);
  const selectedCharge = chargeByDay[selectedDay];

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-500">Calendar</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">カレンダー</h1>
        </div>

        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label="前の月"
                  >
                    <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <p className="text-xl font-bold text-slate-950">2026年5月</p>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label="次の月"
                  >
                    <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                </div>

                <p className="text-center text-4xl font-bold text-slate-950 sm:text-5xl">{formatCurrency(monthlyTotal)}</p>

                <p className="text-left text-sm font-bold text-slate-700 md:text-right">課金件数: {monthlyChargeCount}件</p>
              </div>

              <div className="mt-8 grid grid-cols-7 gap-2 text-center text-xs font-bold">
                {weekdays.map((day, index) => (
                  <div key={day} className={index === 0 ? 'text-rose-500' : index === 6 ? 'text-blue-500' : 'text-slate-500'}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2">
                {days.map((day) => {
                  const isRealDay = day <= 31;
                  const charge = chargeByDay[day];
                  const isChargeDay = Boolean(charge);
                  const isSelected = selectedDay === day;
                  const weekdayIndex = (day - 1) % 7;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (isChargeDay) {
                          setSelectedDay(day);
                        }
                      }}
                      className={`flex aspect-square min-h-[82px] flex-col rounded-xl border p-3 text-left text-sm font-bold transition ${
                        isChargeDay
                          ? isSelected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)]'
                            : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-950'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      disabled={!isRealDay}
                    >
                      <span className={!isChargeDay && weekdayIndex === 0 ? 'text-rose-500' : !isChargeDay && weekdayIndex === 6 ? 'text-blue-500' : ''}>
                        {isRealDay ? day : ''}
                      </span>
                      {isChargeDay && charge ? (
                        <div className="mt-auto text-right">
                          <p className="text-lg font-bold leading-none text-white">{formatCurrency(charge.amount)}</p>
                          <p className="mt-1 text-sm font-semibold leading-none text-slate-300">{charge.count}件</p>
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-600">2026年5月{selectedDay}日（火）</p>
                </div>
                <button type="button" className="text-slate-400 transition hover:text-slate-700" aria-label="詳細を閉じる">
                  <X size={18} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-7">
                <p className="text-xs font-bold text-slate-500">合計金額</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-3xl font-bold text-slate-950">
                    {selectedCharge ? formatCurrency(selectedCharge.amount) : formatCurrency(0)}
                  </p>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                    {selectedCharge?.count ?? 0}件
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-bold text-slate-500">課金内訳</p>
                <div className="mt-4 grid gap-3">
                  {selectedCharge?.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <p className="min-w-0 truncate text-sm font-bold text-slate-700">{item.name}</p>
                      <p className="shrink-0 text-sm font-bold text-slate-950">{formatCurrency(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
