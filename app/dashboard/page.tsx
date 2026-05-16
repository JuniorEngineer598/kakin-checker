import { Crown } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import {
  mockDashboardGameTotals,
  mockDashboardMonthlyChargeCount,
  mockDashboardYearlyTopGame,
  mockDashboardYearlyTotal,
} from '../lib/mockData';

export default function DashboardPage() {
  const monthlyTotal = mockDashboardGameTotals.reduce((sum, game) => sum + game.total, 0);
  const topGame = mockDashboardGameTotals.reduce((top, game) => (game.total > top.total ? game : top), mockDashboardGameTotals[0]);
  const maxTotal = Math.max(...mockDashboardGameTotals.map((game) => game.total), 1);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <div>
          <p className="text-sm font-semibold text-slate-500">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">ホーム</h1>
        </div>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
          <article className="rounded-[28px] bg-slate-950 px-6 py-7 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.65)] sm:rounded-[32px] sm:px-7 lg:min-h-[220px]">
            <p className="text-sm font-medium text-slate-400">今月の課金総額</p>
            <p className="mt-5 text-5xl font-bold text-white sm:text-6xl">{formatCurrency(monthlyTotal)}</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-sm font-medium text-slate-400">年間の課金総額</p>
              <p className="mt-2 text-2xl font-bold text-slate-200 sm:text-3xl">{formatCurrency(mockDashboardYearlyTotal)}</p>
            </div>
          </article>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
              <p className="text-sm font-semibold text-slate-500">今月の課金件数</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{mockDashboardMonthlyChargeCount}件</p>
            </article>

            <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
              <p className="text-sm font-semibold text-slate-500">登録ゲーム数</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{mockDashboardGameTotals.length}</p>
            </article>
            </div>

            <article className="rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Crown size={16} strokeWidth={2.2} className="text-amber-500" aria-hidden="true" />
                <p>課金ランキング</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-3">
                  <p className="text-xs font-bold text-amber-600">今月1位</p>
                  <p className="mt-2 truncate text-xl font-bold text-slate-950">{topGame.name}</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-indigo-300 bg-indigo-50 px-3 py-3">
                  <p className="text-xs font-bold text-indigo-600">年間1位</p>
                  <p className="mt-2 truncate text-xl font-bold text-slate-950">{mockDashboardYearlyTopGame}</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[28px] bg-white px-4 py-6 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.25)] sm:rounded-[32px] sm:px-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">今月のゲーム別課金額</p>
            </div>
            <p className="text-sm font-semibold text-slate-400">2026年5月</p>
          </div>

          <div className="rounded-[24px] bg-slate-50 px-3 py-5 sm:rounded-[28px] sm:px-5">
            <div className="grid min-h-[280px] grid-cols-4 items-end gap-3 sm:gap-5">
              {mockDashboardGameTotals.map((game) => {
                const height = Math.max(36, (game.total / maxTotal) * 200); // グラフ最小36px、最大200pxで高さを調整

                return (
                  <div key={game.name} className="flex min-w-0 flex-col items-center gap-3">
                    <p className="w-full text-center text-[11px] font-bold text-slate-700 sm:text-xs">
                      {formatCurrency(game.total)}
                    </p>

                    <div className="flex h-[200px] w-full items-end justify-center">
                      <div
                        className="w-10 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.8)] sm:w-14"
                        style={{ height: `${height}px`, background: game.color }}
                      />
                    </div>

                    <p className="w-full text-center text-xs font-semibold leading-tight text-slate-700 sm:text-sm">
                      {game.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
