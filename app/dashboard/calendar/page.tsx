"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildCalendarDateCells,
  buildCalendarDayData,
} from "../../lib/calendarStats";
import {
  addMonths,
  formatChargeDateLabel,
  formatCurrency,
  parseChargeDate,
  formatMonthInputValue,
} from "../../lib/format";
import { loadCharges, loadGames } from "../../lib/storage";
import type { ChargeRecord, Game } from "../../lib/types";

const calendarWeekdays = ["日", "月", "火", "水", "木", "金", "土"];
export default function CalendarPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [selectedMonthDate, setSelectedMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const selectedDateLabel = selectedDate
    ? formatChargeDateLabel(parseChargeDate(selectedDate))
    : "";

  useEffect(() => {
    setGames(loadGames());
    setCharges(loadCharges());
  }, []);

  //課金データを日付ごとにまとめる処理
  const dayDataByDate = useMemo(() => {
    return buildCalendarDayData(charges, games);
  }, [charges, games]);

  //カレンダーマスのデータを作る処理
  const calendarCells = useMemo(() => {
    return buildCalendarDateCells(selectedMonthDate, dayDataByDate);
  }, [selectedMonthDate, dayDataByDate]);

  //選択した日付のデータを取得する処理
  const selectedDayData = selectedDate
    ? (dayDataByDate[selectedDate] ?? null)
    : null;

  const monthlyTotal = calendarCells.reduce((total, cell) => {
    return total + (cell.dayData?.totalAmount ?? 0);
  }, 0);

  const monthlyChargeCount = calendarCells.reduce((total, cell) => {
    return total + (cell.dayData?.chargeCount ?? 0);
  }, 0);

  //月移動
  function moveMonth(direction: -1 | 1) {
    setSelectedMonthDate((current) => addMonths(current, direction));
    setSelectedDate(null);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4">
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
                    onClick={() => moveMonth(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label="前の月"
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </button>
                  <input
                    type="month"
                    value={formatMonthInputValue(selectedMonthDate)}
                    onChange={(event) => {
                      const [year, month] = event.target.value
                        .split("-")
                        .map(Number);

                      setSelectedMonthDate(new Date(year, month - 1, 1));
                      setSelectedDate(null);
                    }}
                    className="h-10 min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 text-center text-base font-bold text-slate-950 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => moveMonth(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    aria-label="次の月"
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <p className="text-center text-4xl font-bold text-slate-950 sm:text-5xl">
                  {formatCurrency(monthlyTotal)}
                </p>

                <p className="text-left text-sm font-bold text-slate-700 md:text-right">
                  課金件数: {monthlyChargeCount}件
                </p>
              </div>

              <div className="mt-8 grid grid-cols-7 gap-2 text-center text-xs font-bold">
                {calendarWeekdays.map((day, index) => (
                  <div
                    key={day}
                    className={
                      index === 0
                        ? "text-rose-500"
                        : index === 6
                          ? "text-blue-500"
                          : "text-gray-700"
                    }
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-2">
                {calendarCells.map((cell, index) => {
                  if (!cell.date || !cell.day) {
                    return <div key={`empty-${index}`} />;
                  }
                  const dayData = cell.dayData;
                  const isChargeDay = Boolean(dayData);
                  const isSelected = selectedDate === cell.date;

                  return (
                    <button
                      key={cell.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(cell.date);
                      }}
                      className={`flex aspect-square min-h-[34px] flex-col rounded-xl border p-2.5 text-left text-sm font-bold transition ${
                        isChargeDay
                          ? isSelected
                            ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.95)]"
                            : "border-slate-900 bg-slate-900 text-white hover:bg-slate-950"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cell.day}</span>
                      {dayData ? (
                        <div className="mt-auto text-right">
                          <p className="text-lg font-bold leading-none text-white">
                            {formatCurrency(dayData.totalAmount)}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-none text-slate-300">
                            {dayData.chargeCount}件
                          </p>
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate ? (
              <aside className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-600">
                      {selectedDateLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="text-slate-400 transition hover:text-slate-700"
                    aria-label="詳細を閉じる"
                  >
                    <X size={18} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-7">
                  <p className="text-xs font-bold text-slate-500">合計金額</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-3xl font-bold text-slate-950">
                      {formatCurrency(selectedDayData?.totalAmount ?? 0)}
                    </p>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                      {selectedDayData?.chargeCount ?? 0}件
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <p className="text-xs font-bold text-slate-500">課金内訳</p>
                  <div className="mt-4 grid max-h-[calc(100vh-360px)] gap-3 overflow-y-auto pr-1">
                    {selectedDayData?.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-700">
                            {item.gameName}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-slate-400">
                            {item.itemName} / {item.category}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-slate-950">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            ) : (
              <aside className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-center text-sm font-semibold leading-6 text-slate-400">
                  日付を選択すると詳細情報が表示されます
                </p>
              </aside>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
