"use client";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListChecks,
  MoreVertical,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import GameIconView from "../../components/GameIconView";
import { buildChargeHistory } from "../../lib/chargeHistory";
import {
  addMonths,
  formatChargeMonthLabel,
  formatCurrency,
  formatMonthInputValue,
} from "../../lib/format";
import type { ChargeRecord, Game } from "../../lib/types";
import { fetchApps } from "../../lib/apps";
import { deleteCharge, deleteCharges, fetchCharges } from "../../lib/charges";
import PageBackground from "../../components/PageBackground";

export default function ChargeHistoryPage() {
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedMonthDate, setSelectedMonthDate] = useState(() => new Date());
  const [openChargeMenuId, setOpenChargeMenuId] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedApps = await fetchApps();
        const loadedCharges = await fetchCharges();
        setGames(loadedApps);
        setCharges(loadedCharges);
      } catch {
        setGames([]);
        setCharges([]);
      }
    }

    loadInitialData();
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

  const selectedCount = selectedChargeIds.length;

  function resetSelectionState() {
    setSelectedChargeIds([]);
    setIsSelectMode(false);
    setOpenChargeMenuId(null);
  }

  //月移動の関数 direction: -1 で前の月、1 で次の月
  function moveMonth(direction: -1 | 1) {
    setSelectedMonthDate((current) => addMonths(current, direction));
    resetSelectionState();
  }

  async function handleDeleteCharge(chargeId: string) {
    const ok = window.confirm("この課金記録を消去しますか？");
    if (!ok) return;

    try {
      await deleteCharge(chargeId);

      setCharges((current) =>
        current.filter((charge) => charge.id !== chargeId),
      );
      setOpenChargeMenuId(null);
    } catch {
      window.alert("課金記録の消去に失敗しました");
    }
  }

  function handleToggleSelectMode() {
    setOpenChargeMenuId(null);

    if (isSelectMode) {
      setSelectedChargeIds([]);
    }

    setIsSelectMode(!isSelectMode);
  }

  function handleToggleChargeSelection(chargeId: string) {
    setSelectedChargeIds((current) => {
      if (current.includes(chargeId)) {
        return current.filter((id) => id !== chargeId);
      }

      return [...current, chargeId];
    });
  }

  async function handleDeleteSelectedCharges() {
    if (selectedChargeIds.length === 0) return;

    const ok = window.confirm(
      `選択した${selectedChargeIds.length}件の課金記録を消去しますか？`,
    );

    if (!ok) return;

    try {
      await deleteCharges(selectedChargeIds);

      const selectedIdSet = new Set(selectedChargeIds);

      setCharges((current) =>
        current.filter((charge) => !selectedIdSet.has(charge.id)),
      );
      setSelectedChargeIds([]);
      setIsSelectMode(false);
      setOpenChargeMenuId(null);
    } catch {
      window.alert("課金記録の一括消去に失敗しました");
    }
  }

  return (
    <PageBackground className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <FileText size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">課金履歴</h1>
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
              if (!event.target.value) return;

              const [year, month] = event.target.value.split("-").map(Number);
              setSelectedMonthDate(new Date(year, month - 1, 1));
              resetSelectionState();
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

          {groups.length > 0 ? (
            <button
              type="button"
              onClick={handleToggleSelectMode}
              className={`ml-auto inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 ${
                isSelectMode ? "hover:text-rose-600" : ""
              }`}
            >
              {!isSelectMode ? (
                <ListChecks size={18} strokeWidth={2.2} aria-hidden="true" />
              ) : null}
              {isSelectMode ? "キャンセル" : "選択"}
            </button>
          ) : null}
        </div>

        <section className="max-h-[680px] overflow-y-auto rounded-[28px] bg-white p-3 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:p-6">
          {isSelectMode ? (
            <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-sm font-bold text-slate-700">
                {selectedCount}件選択中
              </p>

              <button
                type="button"
                onClick={handleDeleteSelectedCharges}
                disabled={selectedCount === 0}
                className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                選択した履歴を消去
              </button>
            </div>
          ) : null}

          {groups.length > 0 ? (
            <div className="grid gap-6">
              {groups.map((group) => (
                <section key={group.date}>
                  <div className="mb-3 flex items-center gap-3 px-1 sm:px-0">
                    <h2 className="text-lg font-bold text-slate-950 sm:text-xl">
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
                        className={`grid items-center gap-3 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:px-4 md:gap-4 ${
                          isSelectMode
                            ? "grid-cols-[28px_minmax(0,1fr)_82px] sm:grid-cols-[28px_minmax(0,1fr)_96px] md:grid-cols-[28px_minmax(160px,0.75fr)_minmax(220px,1fr)_120px]"
                            : "grid-cols-[minmax(0,1fr)_82px_36px] sm:grid-cols-[minmax(0,1fr)_96px_36px] md:grid-cols-[minmax(160px,0.75fr)_minmax(220px,1fr)_120px_36px]"
                        }`}
                      >
                        {isSelectMode ? (
                          <input
                            type="checkbox"
                            checked={selectedChargeIds.includes(item.id)}
                            onChange={() => handleToggleChargeSelection(item.id)}
                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`${item.itemName}を選択`}
                          />
                        ) : null}

                        <div className="flex min-w-0 items-center gap-4">
                          <GameIconView
                            icon={item.gameIcon}
                            className="h-11 w-11 shrink-0 md:h-12 md:w-12"
                          />
                          <p className="min-w-0 truncate text-base font-bold text-slate-950 md:text-lg">
                            {item.gameName}
                          </p>
                        </div>

                        <p className="hidden min-w-0 truncate text-base font-semibold text-slate-800 md:block">
                          {item.itemName}
                        </p>
                        <p className="justify-self-end text-right text-base font-bold text-slate-950 sm:text-lg md:text-xl">
                          {formatCurrency(item.amount)}
                        </p>

                        {!isSelectMode ? (
                          <div
                            className="relative justify-self-end"
                            data-charge-menu
                          >
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
                        ) : null}
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
    </PageBackground>
  );
}
