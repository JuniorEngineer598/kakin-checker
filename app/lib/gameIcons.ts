import { Crown, Gamepad2, Gem, Sparkles, Sword } from 'lucide-react';
import type { DefaultGameIconKey } from './types';

// デフォルトのゲームアイコンの順番を定義
export const defaultGameIconKeys: DefaultGameIconKey[] = [
  'gamepad',
  'sparkles',
  'sword',
  'gem',
  'crown',
];

// 表示するアイコンとスタイルの対応を定義
export const defaultGameIconViewByKey = {
  gamepad: {
    icon: Gamepad2,
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  sparkles: {
    icon: Sparkles,
    className: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  sword: {
    icon: Sword,
    className: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  },
  gem: {
    icon: Gem,
    className: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  crown: {
    icon: Crown,
    className: 'bg-rose-50 text-rose-500 ring-rose-100',
  },
} satisfies Record<
  DefaultGameIconKey,
  {
    icon: typeof Gamepad2;
    className: string;
  }
>;

// defaultGameIconKeysの定義に基づいて新規ゲームにアイコンを自動割り当てします。
export function getNextDefaultGameIconKey(index: number) {
  return defaultGameIconKeys[index % defaultGameIconKeys.length];
}
//キーからデフォルトアイコンの表示情報を取得
export function getDefaultGameIconView(key: DefaultGameIconKey) {
  return defaultGameIconViewByKey[key];
}