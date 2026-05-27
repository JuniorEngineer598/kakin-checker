import {
  formatChargeDateLabel,
  formatChargeMonthLabel,
  formatWeekdayLabel,
  parseChargeDate,
} from './format';
import type { ChargeHistoryGroup, ChargeRecord, App } from './types';

export type ChargeHistoryData = {
  groupsByMonth: Record<string, ChargeHistoryGroup[]>;
};

// 課金記録とアプリデータを受け取り、課金履歴表示用のデータ構造に変換する関数
export function buildChargeHistory(charges: ChargeRecord[], apps: App[]): ChargeHistoryData {
  //アプリをIDで検索しやすい形に変換 例:appById.get(charge.appId)
  const appById = new Map(apps.map((app) => [app.id, app]));

  //月ごとの課金履歴グループを入れるオブジェクト
  const groupsByMonth: Record<string, ChargeHistoryGroup[]> = {};

  //課金記録を日付の新しい順にソート b - a で新しい順
  const sortedCharges = [...charges].sort((a, b) => {
    return parseChargeDate(b.chargedAt).getTime() - parseChargeDate(a.chargedAt).getTime();
  });

  //並び替えた課金データを1件ずつ処理して、月ごと・日付ごとにグループ化
  for (const charge of sortedCharges) {
    const date = parseChargeDate(charge.chargedAt);

    const monthLabel = formatChargeMonthLabel(date);//"2026年5月"
    const dateLabel = formatChargeDateLabel(date);//"2026年5月18日"
    const app = appById.get(charge.appId);

    if (!app) {
      continue;
    }

    //月ごとの配列を作成「なければ空の配列を作成」
    groupsByMonth[monthLabel] ??= [];

    //同じ日付のグループを月ごとの配列から検索
    let dateGroup = groupsByMonth[monthLabel].find((item) => item.date === dateLabel);
    if (!dateGroup) {
      dateGroup = {
        date: dateLabel,
        weekday: formatWeekdayLabel(date),
        items: [],
      };
      
      groupsByMonth[monthLabel].push(dateGroup);
    }

    
    dateGroup.items.push({
      id: charge.id,
      appName: app.name,
      appIcon: app.icon,
      itemName: charge.itemName,
      amount: charge.amount,
    });
  }

  return {
    groupsByMonth,
  };
}
