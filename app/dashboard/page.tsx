"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, House } from "lucide-react";
import AppIconView from "../components/AppIconView";
import PageBackground from "../components/PageBackground";
import { buildDashboardStats } from "../lib/dashboardStats";
import { formatChargeMonthLabel, formatCurrency } from "../lib/format";
import { fetchApps } from "../lib/apps";
import { fetchCharges } from "../lib/charges";
import type { App, ChargeRecord } from "../lib/types";

export default function DashboardPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [charges, setCharges] = useState<ChargeRecord[]>([]);
  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedApps = await fetchApps();
        const loadedCharges = await fetchCharges();
        setApps(loadedApps);
        setCharges(loadedCharges);
      } catch {
        setApps([]);
        setCharges([]);
      }
    }

    loadInitialData();
  }, []);

  const stats = useMemo(() => {
    return buildDashboardStats(charges, apps);
  }, [charges, apps]);

  const maxMonthlyAppTotal = Math.max(
    ...stats.monthlyAppTotals.map((item) => item.totalAmount),
    1,
  );

  const currentMonthLabel = formatChargeMonthLabel(new Date());

  return (
    <PageBackground className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3">
        <div className="inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-blue-600 shadow-[0_14px_35px_-24px_rgba(37,99,235,0.8)]">
            <House size={22} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">ホーム</h1>
        </div>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
          <article className="rounded-[28px] bg-slate-950 px-6 py-7 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.65)] sm:rounded-[32px] sm:px-7 lg:min-h-[220px]">
            <p className="text-sm font-medium text-slate-400">今月の課金総額</p>
            <p className="mt-5 text-5xl font-bold text-white sm:text-6xl">
              {formatCurrency(stats.monthlyTotalAmount)}
            </p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-medium text-slate-400">
                年間の課金総額
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-200 sm:text-3xl">
                {formatCurrency(stats.yearlyTotalAmount)}
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
                <p className="text-sm font-semibold text-slate-500">
                  今月の課金件数
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {stats.monthlyChargeCount}件
                </p>
              </article>

              <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
                <p className="text-sm font-semibold text-slate-500">
                  登録アプリ数
                </p>
                <p className="mt-3 text-2xl font-bold text-slate-950">
                  {stats.appCount}
                </p>
              </article>
            </div>

            <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Crown
                  size={16}
                  strokeWidth={2.2}
                  className="text-amber-500"
                  aria-hidden="true"
                />
                <p>課金ランキング</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-3">
                  <p className="text-xs font-bold text-amber-600">今月1位</p>
                  {stats.monthlyTopApp ? (
                    <div className="mt-3 flex min-w-0 items-center gap-3">
                      <AppIconView
                        icon={stats.monthlyTopApp.appIcon}
                        className="h-10 w-10 shrink-0"
                        iconClassName="h-5 w-5"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-950">
                          {stats.monthlyTopApp.appName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-slate-400">
                      該当なし
                    </p>
                  )}
                </div>
                <div className="min-w-0 rounded-2xl border border-indigo-300 bg-indigo-50 px-3 py-3">
                  <p className="text-xs font-bold text-indigo-600">年間1位</p>
                  {stats.yearlyTopApp ? (
                    <div className="mt-3 flex min-w-0 items-center gap-3">
                      <AppIconView
                        icon={stats.yearlyTopApp.appIcon}
                        className="h-10 w-10 shrink-0"
                        iconClassName="h-5 w-5"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-950">
                          {stats.yearlyTopApp.appName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-slate-400">
                      該当なし
                    </p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[28px] bg-white px-4 py-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:rounded-[32px] sm:px-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                今月のアプリ別課金額
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-400">
              {currentMonthLabel}
            </p>
          </div>

          <div className="rounded-[24px] bg-slate-50 px-3 py-5 sm:rounded-[28px] sm:px-5">
            {stats.monthlyAppTotals.length > 0 ? (
              <div className="grid min-h-[280px] grid-flow-col auto-cols-fr items-end gap-3 sm:gap-5">
                {stats.monthlyAppTotals.map((item) => {
                  const height = Math.max(
                    36,
                    (item.totalAmount / maxMonthlyAppTotal) * 200,
                  );

                  return (
                    <div
                      key={item.appId}
                      className="flex min-w-0 flex-col items-center gap-3"
                    >
                      <p className="w-full text-center text-[11px] font-bold text-slate-700 sm:text-xs">
                        {formatCurrency(item.totalAmount)}
                      </p>

                      <div className="flex h-[200px] w-full items-end justify-center">
                        <div
                          className="w-10 rounded-t-xl bg-gradient-to-b from-blue-300 to-blue-500 shadow-[0_12px_30px_-18px_rgba(37,99,235,0.8)] sm:w-14"
                          style={{ height: `${height}px` }}
                        />
                      </div>

                      <div className="flex w-full min-w-0 flex-col items-center gap-2">
                        <AppIconView
                          icon={item.appIcon}
                          className="h-8 w-8 shrink-0"
                          iconClassName="h-4 w-4"
                        />
                        <p className="w-full truncate text-center text-xs font-semibold leading-tight text-slate-700 sm:text-sm">
                          {item.appName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center">
                <p className="text-sm font-semibold text-slate-400">
                  今月の課金データはありません
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageBackground>
  );
}
