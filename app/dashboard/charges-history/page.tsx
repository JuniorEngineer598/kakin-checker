"use client";

import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import GameIconView from "../../components/GameIconView";
import { buildChargeHistory } from "../../lib/chargeHistory";
import {
  formatChargeMonthLabel,
  formatCurrency,
  formatMonthInputValue,
} from "../../lib/format";
import type { ChargeRecord, Game } from "../../lib/types";
import { loadCharges, loadGames, saveCharges } from "../../lib/storage";

export default function ChargeHistoryPage() {
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedMonthDate, setSelectedMonthDate] = useState(() => new Date());
  const [openChargeMenuId, setOpenChargeMenuId] = useState<string | null>(null);

  useEffect(() => {
    setCharges(loadCharges());
    setGames(loadGames());
  }, []);

  //charges と games が更新されるたびに、buildChargeHistory関数を呼び出し
  const { groupsByMonth } = useMemo(() => {
    return buildChargeHistory(charges, games);
  }, [charges, games]);

  const selectedMonth = formatChargeMonthLabel(selectedMonthDate);
  //選択された月のグループを取得。なければ空配列
  const groups = groupsByMonth[selectedMonth] ?? [];
  const totalCount = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups],
  );

  //月移動の関数 direction: -1 で前の月、1 で次の月
  function moveMonth(direction: -1 | 1) {
    setSelectedMonthDate((current) => {
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  }

  function handleDeleteCharge(chargeId: string) {
    const ok = window.confirm("この課金記録を消去しますか？");
    if (!ok) return;

    const nextCharges = charges.filter((charge) => charge.id !== chargeId);
    setCharges(nextCharges);
    saveCharges(nextCharges);
    setOpenChargeMenuId(null);
  }
  
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-500">Charge History</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">課金履歴</h1>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="前の月"
          >
            <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>

          <input
            type="month"
            value={formatMonthInputValue(selectedMonthDate)}
            onChange={(event) => {
              const [year, month] = event.target.value.split("-").map(Number);
              setSelectedMonthDate(new Date(year, month - 1, 1));
            }}
            className="flex h-12 min-w-[180px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-lg font-bold text-slate-950 shadow-sm"
          />

          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="次の月"
          >
            <ChevronRight size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <section className="max-h-[680px] overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-6">
          {groups.length > 0 ? (
            <div className="grid gap-6">
              {groups.map((group) => (
                <section key={group.date}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-950">
                      {group.date}（{group.weekday}）
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {group.items.length}件
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white">
                    {group.items.map((item) => (
                      <article
                        key={item.id}
                        className="grid grid-cols-[minmax(160px,0.75fr)_minmax(220px,1fr)_120px_36px] items-center gap-4 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:px-4"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <GameIconView
                            icon={item.gameIcon}
                            className="h-12 w-12 shrink-0"
                          />
                          <p className="truncate text-lg font-bold text-slate-950">
                            {item.gameName}
                          </p>
                        </div>

                        <p className="min-w-0 truncate text-base font-semibold text-slate-800">
                          {item.itemName}
                        </p>
                        <p className="text-right text-xl font-bold text-slate-950">
                          {formatCurrency(item.amount)}
                        </p>
                        <div className="relative justify-self-end" data-charge-menu>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label={`${item.itemName}のメニュー`}
                            aria-expanded={openChargeMenuId === item.id}
                            onClick={() =>
                              setOpenChargeMenuId((current) =>
                                current === item.id ? null : item.id,
                              )
                            }
                          >
                            <MoreVertical
                              size={19}
                              strokeWidth={2.2}
                              aria-hidden="true"
                            />
                          </button>

                          {openChargeMenuId === item.id ? (
                            <div className="absolute right-0 top-10 z-20 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]">
                              <button
                                type="button"
                                onClick={() => handleDeleteCharge(item.id)}
                                className="flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                              >
                                消去
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-semibold text-slate-400">
              この月の課金履歴はありません。
            </div>
          )}

          <p className="mt-6 text-center text-sm font-bold text-slate-600">
            合計 {totalCount} 件
          </p>
        </section>
      </div>
    </main>
  );
}
