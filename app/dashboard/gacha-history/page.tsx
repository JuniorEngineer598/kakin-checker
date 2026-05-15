'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Crown, Gem, Gamepad2, MoreVertical, Sparkles, Sword } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

type GachaHistoryItem = {
  id: string;
  gameName: string;
  itemName: string;
  amount: number;
  icon: LucideIcon;
  iconClassName: string;
};

type GachaHistoryGroup = {
  date: string;
  weekday: string;
  items: GachaHistoryItem[];
};

const months = ['2026年5月', '2026年6月', '2026年7月'];

const gachaHistoryByMonth: Record<string, GachaHistoryGroup[]> = {
  '2026年5月': [
    {
      date: '2026年5月28日',
      weekday: '木',
      items: [
        {
          id: 'may28-1',
          gameName: '原神',
          itemName: '神里綾華 ピックアップ祈願',
          amount: 1600,
          icon: Sparkles,
          iconClassName: 'bg-blue-50 text-blue-600 ring-blue-100',
        },
        {
          id: 'may28-2',
          gameName: 'ブルアカ',
          itemName: 'ヒナ（ドレス）ピックアップ募集',
          amount: 1600,
          icon: Sword,
          iconClassName: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
        },
        {
          id: 'may28-3',
          gameName: 'NIKKE',
          itemName: '新指揮官専用募集',
          amount: 30000,
          icon: Crown,
          iconClassName: 'bg-rose-50 text-rose-500 ring-rose-100',
        },
      ],
    },
    {
      date: '2026年5月21日',
      weekday: '木',
      items: [
        {
          id: 'may21-1',
          gameName: 'モンスト',
          itemName: '激・獣神祭',
          amount: 1600,
          icon: Gamepad2,
          iconClassName: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
        },
        {
          id: 'may21-2',
          gameName: '原神',
          itemName: '空月の祝福（30日）',
          amount: 610,
          icon: Sparkles,
          iconClassName: 'bg-blue-50 text-blue-600 ring-blue-100',
        },
      ],
    },
    {
      date: '2026年5月14日',
      weekday: '木',
      items: [
        {
          id: 'may14-1',
          gameName: 'ブルアカ',
          itemName: 'ユウカ（体操服）ピックアップ募集',
          amount: 1600,
          icon: Sword,
          iconClassName: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
        },
        {
          id: 'may14-2',
          gameName: 'NIKKE',
          itemName: 'デイリージュエルパック',
          amount: 800,
          icon: Crown,
          iconClassName: 'bg-rose-50 text-rose-500 ring-rose-100',
        },
        {
          id: 'may14-3',
          gameName: 'ゼンレスゾーンゼロ',
          itemName: '暗号化マスターテープ x10',
          amount: 1480,
          icon: Gem,
          iconClassName: 'bg-amber-50 text-amber-600 ring-amber-100',
        },
      ],
    },
  ],
  '2026年6月': [
    {
      date: '2026年6月7日',
      weekday: '日',
      items: [
        {
          id: 'jun7-1',
          gameName: '原神',
          itemName: '限定祈願パック',
          amount: 3200,
          icon: Sparkles,
          iconClassName: 'bg-blue-50 text-blue-600 ring-blue-100',
        },
      ],
    },
  ],
  '2026年7月': [],
};

function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function GachaHistoryPage() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const selectedMonth = months[selectedMonthIndex];
  const groups = gachaHistoryByMonth[selectedMonth] ?? [];
  const totalCount = useMemo(() => groups.reduce((sum, group) => sum + group.items.length, 0), [groups]);

  function moveMonth(direction: -1 | 1) {
    setSelectedMonthIndex((current) => {
      const nextIndex = current + direction;
      if (nextIndex < 0 || nextIndex >= months.length) {
        return current;
      }

      return nextIndex;
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-500">Gacha History</p>
          <h1 className="mt-1 text-4xl font-bold text-slate-950">ガチャ履歴</h1>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="前の月"
          >
            <ChevronLeft size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="flex h-12 min-w-[180px] items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 text-lg font-bold text-slate-950 shadow-sm"
          >
            {selectedMonth}
            <ChevronDown size={18} strokeWidth={2.2} className="text-slate-500" aria-hidden="true" />
          </button>

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

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {group.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <article
                          key={item.id}
                          className="grid grid-cols-[minmax(160px,0.75fr)_minmax(220px,1fr)_120px_36px] items-center gap-4 border-b border-slate-200 px-3 py-3 last:border-b-0 sm:px-4"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${item.iconClassName}`}>
                              <Icon size={23} strokeWidth={2.2} aria-hidden="true" />
                            </div>
                            <p className="truncate text-lg font-bold text-slate-950">{item.gameName}</p>
                          </div>

                          <p className="min-w-0 truncate text-base font-semibold text-slate-800">{item.itemName}</p>
                          <p className="text-right text-xl font-bold text-slate-950">{formatCurrency(item.amount)}</p>
                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label={`${item.itemName}のメニュー`}
                          >
                            <MoreVertical size={19} strokeWidth={2.2} aria-hidden="true" />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center text-sm font-semibold text-slate-400">
              この月のガチャ履歴はありません。
            </div>
          )}

          <p className="mt-6 text-center text-sm font-bold text-slate-600">合計 {totalCount} 件</p>
        </section>
      </div>
    </main>
  );
}
