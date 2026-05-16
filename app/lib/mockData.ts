import { Crown, Gem, Gamepad2, Sparkles, Sword } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChargeCategory } from './types';

export type MockGameTotal = {
  name: string;
  total: number;
  color: string;
};

export type MockMonthAnalytics = {
  month: string;
  amount: number;
  count: number;
};

export type MockChargeDay = {
  amount: number;
  count: number;
  items: {
    name: string;
    amount: number;
  }[];
};

export type MockChargeHistoryItem = {
  id: string;
  gameName: string;
  itemName: string;
  amount: number;
  icon: LucideIcon;
  iconClassName: string;
};

export type MockChargeHistoryGroup = {
  date: string;
  weekday: string;
  items: MockChargeHistoryItem[];
};



export const mockDashboardGameTotals: MockGameTotal[] = [
  { name: '原神', total: 18000, color: 'linear-gradient(180deg, #7dd3fc 0%, #14b8a6 100%)' },
  { name: 'ブルアカ', total: 9800, color: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)' },
  { name: 'モンスト', total: 7200, color: 'linear-gradient(180deg, #facc15 0%, #f97316 100%)' },
  { name: 'NIKKE', total: 12400, color: 'linear-gradient(180deg, #fb7185 0%, #dc2626 100%)' },
];

export const mockDashboardYearlyTotal = 284600;
export const mockDashboardMonthlyChargeCount = 12;
export const mockDashboardYearlyTopGame = 'ブルアカ';

export const mockAnalyticsData: Record<number, MockMonthAnalytics[]> = {
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

export const mockSelectableYears = Array.from({ length: 25 }, (_, index) => 2026 + index);
export const mockMonthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export const mockCalendarDays = Array.from({ length: 35 }, (_, index) => index + 1);
export const mockWeekdays = ['日', '月', '火', '水', '木', '金', '土'];
export const mockChargeByDay: Record<number, MockChargeDay> = {
  3: { amount: 980, count: 1, items: [{ name: '祝福パック', amount: 980 }] },
  8: { amount: 1220, count: 1, items: [{ name: '紀行', amount: 1220 }] },
  14: { amount: 6100, count: 1, items: [{ name: '創世結晶', amount: 6100 }] },
  21: { amount: 9800, count: 1, items: [{ name: '限定パック', amount: 9800 }] },
  28: { amount: 29300, count: 1, items: [{ name: '大型パック', amount: 29300 }] },
};
export const mockCalendarMonthlyTotal = 47400;
export const mockCalendarMonthlyChargeCount = 5;

export const mockChargeHistoryMonths = ['2026年5月', '2026年6月', '2026年7月'];

export const mockChargeHistoryByMonth: Record<string, MockChargeHistoryGroup[]> = {
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

//ゲームテンプレート
export const mockChargeGames = ['原神', 'ブルアカ', 'モンスト', 'NIKKE'];

//課金追加テンプレート

//ゲームアイコン
export const mockGameIconStyles = [
  { icon: Sparkles, className: 'bg-blue-50 text-blue-600 ring-blue-100' },
  { icon: Sword, className: 'bg-indigo-50 text-indigo-600 ring-indigo-100' },
  { icon: Gamepad2, className: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
  { icon: Gem, className: 'bg-amber-50 text-amber-600 ring-amber-100' },
  { icon: Crown, className: 'bg-rose-50 text-rose-500 ring-rose-100' },
];

export const mockGameTotalAmounts = [18000, 9800, 7200, 12400, 3600];
